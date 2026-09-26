# ============================================================
# SEED LIVESTOCK DEMO DATA
# ============================================================
#
# Creates 20 farms across Maharashtra districts with 3
# livestock reports each. So the officer queue and hotspot
# map have data to display.
#
# Idempotent: skips if the demo farmer already exists.
#
# Usage:
#     python seed_livestock_demo.py
# ============================================================

import random
from datetime import datetime, timedelta

from database import (
    SessionLocal,
    Farmer,
    Farm,
    Crop,
    CropSeason,
    HealthReport,
    AIPrediction,
    RiskAssessment,
)


DEMO_EMAIL = "livestock@demo.local"

DISTRICTS = [
    ("Nashik",      19.9975, 73.7898, "Lumpy Skin Disease",     "HIGH",     72.0),
    ("Pune",        18.5204, 73.8567, "Foot and Mouth Disease", "HIGH",     68.0),
    ("Satara",      17.6805, 74.0183, "Foot Infection",         "MODERATE", 45.0),
    ("Solapur",     17.6599, 75.9064, "Lumpy Skin Disease",     "MODERATE", 48.0),
    ("Ahmednagar",  19.0948, 74.7480, "Foot and Mouth Disease", "HIGH",     65.0),
    ("Kolhapur",    16.7050, 74.2433, "Lumpy Skin Disease",     "CRITICAL", 82.0),
    ("Sangli",      16.8524, 74.5815, "Foot Infection",         "MODERATE", 42.0),
    ("Latur",       18.4088, 76.5604, "Healthy",                "LOW",      5.0),
    ("Nagpur",      21.1458, 79.0882, "Foot and Mouth Disease", "HIGH",     70.0),
    ("Aurangabad",  19.8762, 75.3433, "Lumpy Skin Disease",     "HIGH",     74.0),
    ("Amravati",    20.9320, 77.7523, "Foot Infection",         "MODERATE", 44.0),
    ("Nanded",      19.1383, 77.3210, "Foot and Mouth Disease", "MODERATE", 50.0),
    ("Jalgaon",     21.0077, 75.5626, "Lumpy Skin Disease",     "MODERATE", 52.0),
    ("Akola",       20.7002, 77.0082, "Foot Infection",         "HIGH",     66.0),
    ("Buldhana",    20.5292, 76.1842, "Lumpy Skin Disease",     "CRITICAL", 79.0),
    ("Washim",      20.1110, 77.1332, "Foot and Mouth Disease", "HIGH",     63.0),
    ("Yavatmal",    20.3880, 78.1204, "Foot Infection",         "MODERATE", 55.0),
    ("Beed",        18.9890, 75.7600, "Lumpy Skin Disease",     "HIGH",     71.0),
    ("Osmanabad",   18.1860, 76.0417, "Foot Infection",         "MODERATE", 47.0),
    ("Parbhani",    19.2704, 76.7741, "Foot and Mouth Disease", "MODERATE", 43.0),
]


def _demo_exists(db):
    return (
        db.query(Farmer)
        .filter(Farmer.email == DEMO_EMAIL)
        .first()
        is not None
    )


def seed(db):
    summary = {
        "skipped": False,
        "farms_created": 0,
        "seasons_created": 0,
        "reports_created": 0,
        "predictions_created": 0,
        "risks_created": 0,
    }

    if _demo_exists(db):
        summary["skipped"] = True
        return summary

    # --------------------------------------------------------
    # Demo farmer
    # --------------------------------------------------------

    farmer = Farmer(
        name="Demo Livestock Owner",
        phone="0000000002",
        email=DEMO_EMAIL,
        preferred_language="English",
    )
    db.add(farmer)
    db.flush()

    # --------------------------------------------------------
    # Cattle crop (reused as "herd")
    # --------------------------------------------------------

    cattle = (
        db.query(Crop)
        .filter(Crop.name == "Cattle")
        .first()
    )

    if not cattle:
        cattle = Crop(
            name="Cattle",
            scientific_name="Bos taurus indicus",
            category="Livestock",
            description="Cattle herd for livestock health monitoring",
        )
        db.add(cattle)
        db.flush()

    now = datetime.utcnow()

    for district, lat, lon, condition, risk_level, risk_score in DISTRICTS:

        farm = Farm(
            farmer_id=farmer.id,
            farm_name=f"{district} Cattle Farm",
            latitude=lat,
            longitude=lon,
            district=district,
            state="Maharashtra",
        )
        db.add(farm)
        db.flush()
        summary["farms_created"] += 1

        season = CropSeason(
            farm_id=farm.id,
            crop_id=cattle.id,
            variety="Local breed",
            planting_date=(now - timedelta(days=45)).date(),
            expected_harvest_date=(now + timedelta(days=320)).date(),
            status="ACTIVE",
        )
        db.add(season)
        db.flush()
        summary["seasons_created"] += 1

        for _ in range(3):

            jitter_lat = lat + random.uniform(-0.008, 0.008)
            jitter_lon = lon + random.uniform(-0.008, 0.008)
            days_ago = random.randint(1, 10)
            reported_at = now - timedelta(days=days_ago)

            report = HealthReport(
                farm_id=farm.id,
                crop_season_id=season.id,
                latitude=jitter_lat,
                longitude=jitter_lon,
                source="FARMER",
                status="COMPLETED",
                reported_at=reported_at,
            )
            db.add(report)
            db.flush()
            summary["reports_created"] += 1

            confidence = round(random.uniform(0.85, 0.98), 4)

            pred = AIPrediction(
                health_report_id=report.id,
                model_name="livestock-disease-v1",
                model_version="1.0",
                prediction_type="CLASSIFICATION",
                predicted_class=condition,
                confidence=confidence,
                prediction_data={"disease": condition},
            )
            db.add(pred)
            summary["predictions_created"] += 1

            jitter_risk = max(
                0.0,
                min(100.0, risk_score + random.uniform(-5, 5)),
            )

            risk = RiskAssessment(
                health_report_id=report.id,
                risk_score=round(jitter_risk, 1),
                risk_level=risk_level,
                calculation_method="rule-engine-v1",
                factors=[],
            )
            db.add(risk)
            summary["risks_created"] += 1

    return summary


def main():
    db = SessionLocal()
    try:
        result = seed(db)
        db.commit()

        print("Livestock seed complete.")
        print()
        for k, v in result.items():
            print(f"  {k:<22} {v}")

        if result.get("skipped"):
            print()
            print("Demo data already exists — skipped.")

    except Exception as e:
        db.rollback()
        print(f"Seed failed — rolled back. Reason: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()