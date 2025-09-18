import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))

import pytest
from fastapi.testclient import TestClient

try:
    from main import app
except ImportError:
    import importlib.util
    spec = importlib.util.spec_from_file_location("app.main", os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../main.py")))
    app = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(app)
    app = app.app

client = TestClient(app)

def test_get_existing_customer_profile():
    response = client.get("/customer-profile/1")
    assert response.status_code == 200
    data = response.json()
    assert "customer" in data
    assert data["customer"]["id"] == 1
    assert "recommendations" in data
    assert isinstance(data["recommendations"], list)

def test_get_nonexistent_customer_profile():
    response = client.get("/customer-profile/99999")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Customer not found"

def test_get_customer_profile_invalid_id():
    response = client.get("/customer-profile/abc")
    assert response.status_code == 422 or response.status_code == 400
