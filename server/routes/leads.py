from flask import Blueprint, request, jsonify
from models import db, Lead, Contact
from datetime import datetime

leads_bp = Blueprint('leads', __name__)