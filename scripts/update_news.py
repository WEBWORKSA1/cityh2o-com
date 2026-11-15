#!/usr/bin/env python3
"""CityH2O daily news updater.

Pulls public RSS feeds about drinking water, de-duplicates and tags them by
topic, and writes data/news.json for the site to render client-side.
Standard library only, so it runs on any GitHub Actions runner with no installs.
"""
import json, re, sys, html, datetime as dt, urllib.request, urllib.parse
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "news.json"
MAX_ITEMS = 120
MAX_AGE_DAYS = 45

def gnews(q):
    return "https://news.google.com/rss/search?" + urllib.parse.urlencode(
        {"q": q + " when:14d", "hl": "en-US", "gl": "US", "ceid": "US:en"})

FEEDS = [
    ("Lead",            gnews('"lead pipes" OR "lead service line" drinking water')),
    ("PFAS",            gnews('PFAS "drinking water"')),
    ("Boil advisories", gnews('"boil water advisory" OR "boil water notice"')),
    ("Utilities",       gnews('"water utility" OR "water main break" OR "water treatment plant"')),
    ("Policy",          gnews('EPA "drinking water" rule OR regulation')),
    ("Utilities",       "https://news.google.com/rss/search?" + urllib.parse.urlencode(
        {"q": '"drinking water" OR "tap water" when:14d', "hl": "en-CA", "gl": "CA", "ceid": "CA:en"})),
    ("Global",          "https://www.circleofblue.org/feed/"),
]

UA = {"User-Agent": "CityH2O-NewsBot/1.0 (+https://cityh2o.com/news.html)"}
TAG = re.compile(r"<[^>]+>")

def text(el, *names):
    for n in names:
        x = el.find(n)
        if x is not None and (x.text or "").strip():
            return x.text.strip()
    return ""

def parse_date(s):
    try:
        d = parsedate_to_datetime(s)
        if d.tzinfo is None:
            d = d.replace(tzinfo=dt.timezone.utc)
        return d.astimezone(dt.timezone.utc)
    except Exception:
        return None

def fetch(topic, url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=25) as r:
        root = ET.fromstring(r.read())
    items = []
    for it in root.iter("item"):
        title = html.unescape(TAG.sub("", text(it, "title")))
        link = text(it, "link")
        src_el = it.find("source")
        source = (src_el.text or "").strip() if src_el is not None else ""
        if not source and " - " in title:
            title, source = title.rsplit(" - ", 1)
        elif source and title.endswith(" - " + source):
            title = title[: -len(" - " + source)]
        if not source:
            source = urllib.parse.urlparse(url).netloc.replace("www.", "")
        d = parse_date(text(it, "pubDate"))
        if title and link:
            items.append({"title": title.strip(), "link": link, "source": source,
                          "date": d.isoformat() if d else None, "topic": topic})
    return items

RULES = [("PFAS", r"\bpfas\b|forever chemical|pfoa|pfos"),
         ("Lead", r"\blead (pipe|service|line|level|contamin|in)|\blead-|copper rule"),
         ("Boil advisories", r"boil[- ](water|notice|order|advisory)")]

def classify(title, default):
    t = title.lower()
    for topic, rx in RULES:
        if re.search(rx, t):
            return topic
    return default

def norm(t):
    return re.sub(r"[^a-z0-9]+", " ", t.lower()).strip()[:90]

def main():
    old = {}
    if OUT.exists():
        try:
            old = json.loads(OUT.read_text())
        except Exception:
            old = {}
    fresh, ok = [], 0
    for topic, url in FEEDS:
        try:
            got = fetch(topic, url)
            fresh.extend(got)
            ok += 1
            print(f"[ok] {topic}: {len(got)}")
        except Exception as e:
            print(f"[skip] {topic}: {e}", file=sys.stderr)
    if ok == 0:
        print("No feeds reachable; keeping existing file.")
        return
    for i in fresh:
        i["topic"] = classify(i["title"], i["topic"])
    pool = fresh + list(old.get("items", []))
    cutoff = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=MAX_AGE_DAYS)
    seen, items = set(), []
    for i in pool:
        k = norm(i["title"])
        if k in seen:
            continue
        if i.get("date"):
            try:
                if dt.datetime.fromisoformat(i["date"]) < cutoff:
                    continue
            except Exception:
                pass
        seen.add(k)
        items.append(i)
    items.sort(key=lambda i: i.get("date") or "", reverse=True)
    out = {"updated": dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
           "items": items[:MAX_ITEMS]}
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1))
    print(f"Wrote {len(out['items'])} items")

if __name__ == "__main__":
    main()
