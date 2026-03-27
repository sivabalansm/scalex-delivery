#!/usr/bin/env python3
"""
Sync Tables from Dev to Production

This script copies table data from the dev bot to the production bot.
Run the import_excel_data workflow in dev first, then run this script.

Usage:
    python sync-tables-to-prod.py              # Sync dev → prod
    python sync-tables-to-prod.py --wipe       # Wipe prod tables, then sync
    python sync-tables-to-prod.py --wipe-only  # Wipe all prod tables (no sync)
    python sync-tables-to-prod.py --wipe-only --dev  # Wipe all dev tables

Requirements:
    pip install requests
"""

import requests
import os
import sys

# Configuration
DEV_BOT_ID = "a6ad1158-f7ec-47b1-b184-9c43b23efcaf"  # Source (scalex dev workspace)
PROD_BOT_ID = "c78b00b2-52e3-408e-a81f-fbdad7e7f369"  # Target (Alex's workspace)
DEV_WORKSPACE_ID = "wkspace_01KFBW6V7AXG45V7MA1KHWZA4V"
PROD_WORKSPACE_ID = "wkspace_01KCYMP0188JKY90CF7W0TYA33"
WORKSPACE_ID = DEV_WORKSPACE_ID  # Default for fetch; overridden per-call below
API_URL = "https://api.botpress.cloud"

# Tables to sync
TABLES = [
    "modifiersTable",
    "serviceVendorMapTable",
    "serviceTypesTable",
    "baseRatesTable",
    "vendorsTable",
    "locationsTable",
    "towersTable",
    "vendorIdMappingTable",
    "serviceNameAliasesTable",
    "categoriesTable",
    "vendorLocationsTable",
    "baseRatesExtTable",
    "serviceTypesExtTable",
    "vendorsExtTable",
    "contractBenchmarksTable",
    "managedServiceLoadTable",
    "modifierAdjustmentsTable",
    "riskRulesTable",
    "taxonomyCrosswalksTable",
    "treatmentRecommendationsTable",
    "contractsUploadTable",
    "extractedClausesTable",
    "extractionActivityTable",
    "slaTable",
    "serviceTypeSlaTable",
    "conversationalFeedbackTable",
    "usageTrackingTable",
    "messageFeedbackTable",
    "sessionSurveyTable",
]

WIPE_BEFORE_SYNC = "--wipe" in sys.argv
WIPE_ONLY = "--wipe-only" in sys.argv
TARGET_DEV = "--dev" in sys.argv

def get_api_token():
    """Get API token from environment or prompt"""
    token = os.environ.get("BP_TOKEN")
    if not token:
        token = input("Enter your Botpress API token: ").strip()
    if not token:
        print("❌ API token required")
        sys.exit(1)
    return token

def fetch_all_rows(token: str, bot_id: str, table: str) -> list:
    """Fetch all rows from a table (handles pagination)"""
    ws_id = DEV_WORKSPACE_ID if bot_id == DEV_BOT_ID else PROD_WORKSPACE_ID
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "x-bot-id": bot_id,
        "x-workspace-id": ws_id,
    }

    all_rows = []
    offset = 0
    limit = 100  # Max per request

    while True:
        url = f"{API_URL}/v1/tables/{table}/rows/find"
        payload = {"limit": limit, "offset": offset}

        response = requests.post(url, headers=headers, json=payload)
        if response.status_code != 200:
            print(f"  ❌ Error fetching {table}: {response.status_code}")
            print(f"     {response.text[:200]}")
            break

        data = response.json()
        rows = data.get("rows", [])

        if not rows:
            break

        all_rows.extend(rows)
        offset += len(rows)

        if len(rows) < limit:
            break

    return all_rows

def upsert_rows(token: str, bot_id: str, table: str, rows: list):
    """Upsert rows to a table in batches using the correct upsert endpoint"""
    ws_id = DEV_WORKSPACE_ID if bot_id == DEV_BOT_ID else PROD_WORKSPACE_ID
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "x-bot-id": bot_id,
        "x-workspace-id": ws_id,
    }

    batch_size = 100
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]

        # Clean rows - remove system fields INCLUDING id (dev IDs don't exist in prod)
        # The keyColumn (vendorId/reviewId) will be used for upsert matching
        cleaned_batch = []
        for row in batch:
            cleaned = {k: v for k, v in row.items()
                      if k not in ["id", "createdAt", "updatedAt", "computed", "stale"]}
            cleaned_batch.append(cleaned)

        # Use the correct upsert endpoint: POST /v1/tables/{table}/rows/upsert
        url = f"{API_URL}/v1/tables/{table}/rows"
        payload = {
            "rows": cleaned_batch,
        }

        response = requests.post(url, headers=headers, json=payload)
        if response.status_code not in [200, 201]:
            print(f"  ❌ Error upserting batch {i//batch_size + 1}: {response.status_code}")
            print(f"     {response.text[:300]}")
        else:
            result = response.json()
            inserted = result.get("inserted", 0)
            updated = result.get("updated", 0)
            print(f"  ✓ Batch {i//batch_size + 1}/{(len(rows) + batch_size - 1)//batch_size} (inserted: {inserted}, updated: {updated})")

def wipe_table_rows(token: str, bot_id: str, table: str):
    """Delete all rows from a table in prod"""
    ws_id = DEV_WORKSPACE_ID if bot_id == DEV_BOT_ID else PROD_WORKSPACE_ID
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "x-bot-id": bot_id,
        "x-workspace-id": ws_id,
    }

    print(f"  🧹 Wiping {table}...")
    total_deleted = 0
    limit = 100

    while True:
        # Always fetch from offset 0 since we're deleting rows each iteration
        find_url = f"{API_URL}/v1/tables/{table}/rows/find"
        find_payload = {"limit": limit, "offset": 0}
        find_response = requests.post(find_url, headers=headers, json=find_payload)

        if find_response.status_code != 200:
            print(f"  ❌ Could not list rows for {table}: {find_response.status_code}")
            print(f"     {find_response.text[:200]}")
            return total_deleted

        rows = find_response.json().get("rows", [])
        if not rows:
            break

        row_ids = [row.get("id") for row in rows if row.get("id")]
        if not row_ids:
            break

        delete_url = f"{API_URL}/v1/tables/{table}/rows/delete"
        delete_payload = {"ids": row_ids}
        delete_response = requests.post(delete_url, headers=headers, json=delete_payload)

        if delete_response.status_code not in [200, 204]:
            print(f"  ❌ Delete failed for {table}: {delete_response.status_code}")
            print(f"     {delete_response.text[:200]}")
            return total_deleted

        total_deleted += len(row_ids)
        print(f"  🗑️  Deleted {total_deleted} rows so far...")

    print(f"  ✅ Wiped {total_deleted} rows from {table}")
    return total_deleted


def main():
    if WIPE_ONLY:
        target_bot_id = DEV_BOT_ID if TARGET_DEV else PROD_BOT_ID
        env_label = "DEV" if TARGET_DEV else "PROD"
        print("=" * 60)
        print(f"🧹 WIPE ALL TABLES IN {env_label}")
        print("=" * 60)
        print(f"\n⚠️  This will DELETE ALL ROWS from {len(TABLES)} tables in {env_label}!")
        print(f"   Bot ID: {target_bot_id}\n")
        confirm = input("Type 'yes' to confirm: ").strip()
        if confirm != "yes":
            print("Aborted.")
            sys.exit(0)

        token = get_api_token()
        grand_total = 0

        for table in TABLES:
            print(f"\n📋 {table}")
            print("-" * 40)
            deleted = wipe_table_rows(token, target_bot_id, table)
            grand_total += deleted

        print("\n" + "=" * 60)
        print(f"✅ WIPE COMPLETE — {grand_total} total rows deleted across {len(TABLES)} tables")
        print("=" * 60)
        return

    print("=" * 60)
    print("🔄 SYNC TABLES: DEV → PROD")
    print("=" * 60)

    token = get_api_token()

    for table in TABLES:
        print(f"\n📋 {table}")
        print("-" * 40)

        # Fetch from dev
        print(f"  📥 Fetching from dev...")
        dev_rows = fetch_all_rows(token, DEV_BOT_ID, table)
        print(f"  ✓ Found {len(dev_rows)} rows in dev")

        if not dev_rows:
            print(f"  ⚠️  No data to sync")
            continue

        # Optional wipe to avoid stale rows
        if WIPE_BEFORE_SYNC:
            wipe_table_rows(token, PROD_BOT_ID, table)

        # Upsert to prod
        print(f"  📤 Uploading to prod...")
        upsert_rows(token, PROD_BOT_ID, table, dev_rows)
        print(f"  ✅ Synced {len(dev_rows)} rows to prod")

    print("\n" + "=" * 60)
    print("✅ SYNC COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    main()
