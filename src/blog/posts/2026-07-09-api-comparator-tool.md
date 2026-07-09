# API Comparator Tool — Find Differences Between API Versions

When you're migrating from API v1 to v2, one of the most tedious tasks is figuring out what actually changed. Did they rename `user_name` to `username`? Did they drop the `address` field? Is the `id` field now a string instead of a number?

Manually calling both endpoints and squinting at JSON diffs gets old fast. So I built **API Comparator** — a tool right inside this portfolio that automates it.

## How It Works

The tool lets you configure two API endpoints (old and new), hit them with a list of IDs, and then **recursively compares** every field in the responses. It surfaces three kinds of changes:

1. **Missing fields** — exist in old but not in new
2. **Extra fields** — exist in new but not in old
3. **Type changes** — same field, different type (e.g. `string` → `number`)

## Postman-Style Configuration

The config UI mimics Postman with separate tabs for Old API and New API:

| Field | Description |
|-------|-------------|
| **URL** | Endpoint URL — use `{{id}}` as a placeholder |
| **Method** | GET, POST, PUT, PATCH, DELETE, etc. |
| **Headers** | Key-value rows with on/off toggles |
| **Query Params** | Key-value rows with on/off toggles |
| **Body** | JSON body, shown only for POST/PUT/PATCH |

A third tab lets you provide a list of IDs (comma or space-separated) to iterate through.

## Example

Say you're migrating from a legacy API to a new one:

```
Old: https://api.example.com/v1/users/{{id}}
New: https://api.example.com/v2/users/{{id}}
```

Run it with IDs `[1, 2, 3]` and you'll get a summary report like:

```
Missing Fields (3):
  address.street    → "123 Main St"    [IDs: 1, 2, 3]
  address.city      → "Springfield"    [IDs: 1, 2]
  phone             → "555-1234"       [IDs: 1, 3]

Extra Fields (2):
  profile.bio       → "Hello world"    [IDs: 1, 2, 3]
  metadata.version  → 2                [IDs: 1, 2, 3]

Type Changes (1):
  id: string → number                  [IDs: 1, 2, 3]
```

## The Comparison Logic

The `deepCompare` function walks both response objects recursively:

- For **objects**, it checks each key exists in both sides and recurses into nested objects
- For **arrays**, it compares element-by-element for arrays of objects, or uses set-based comparison for primitive arrays
- **Null** vs missing is handled intelligently — it's flagged as a type change, not just missing
- The comparison is **path-aware**, so you get full dotted paths like `user.profile.avatar`

## Try It

You can find the tool under **Tools → API Comparator** on this site. Just paste your API details and IDs, hit "Run Comparison", and you'll get a clean breakdown of every difference across all your test IDs in one place.

The full source is in `src/pages/ApiComparator.jsx` if you want to see how it works under the hood.
