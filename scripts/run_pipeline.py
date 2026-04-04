"""Orchestrator script to run all download and transform steps."""
import subprocess
import sys
import os

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))

def run(script_path):
    print(f"\n{'='*60}")
    print(f"Running: {script_path}")
    print('='*60)
    result = subprocess.run([sys.executable, script_path], cwd=SCRIPTS_DIR)
    if result.returncode != 0:
        print(f"WARNING: {script_path} exited with code {result.returncode}")
    return result.returncode

if __name__ == "__main__":
    # Download
    run(os.path.join(SCRIPTS_DIR, "download", "weather_openmeteo.py"))

    # Transform
    run(os.path.join(SCRIPTS_DIR, "transform", "aqi_transform.py"))

    print("\n\nPipeline complete. Copy processed files to dashboard:")
    print("  cp ../data/processed/*.json ../dashboard/public/data/")
