import joblib
import pandas as pd
import numpy as np
from typing import List, Dict, Any
from app.models.models import Customer
from app.db.database import get_db
from sqlalchemy.orm import Session
import os
import logging

logger = logging.getLogger(__name__)

class RecommendationService:
    def __init__(self):
        self.model = None
        self.load_model()
        
        # Product mappings based on model predictions
        self.product_mappings = {
            0: "Premium Credit Card",
            1: "Investment Portfolio", 
            2: "Business Credit Line",
            3: "Savings Account Plus",
            4: "Personal Loan",
            5: "Mortgage Refinance",
            6: "Insurance Package",
            7: "Foreign Exchange Service"
        }
    
    def load_model(self):
        """Load the trained ML model"""
        try:
            # Assumes the model directory is a sibling of the services directory
            model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "xgmodels2", "xgb_model.pkl")
            self.model = joblib.load(model_path)
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            self.model = None
    
    def prepare_customer_features(self, customer: Customer) -> List[float]:
        """
        Convert customer data to the 33 features expected by the model
        """
        try:
            # Handle enum conversions
            employment_type_map = {"Retired": 0, "Salaried": 1, "Self-Employed": 2, "Student": 3}
            marital_status_map = {"Divorced": 0, "Married": 1, "Single": 2, "Widowed": 3}
            residence_status_map = {"Family": 0, "Owned": 1, "Rented": 2}
            nationality_map = {"BD": 0, "EG": 1, "IN": 2, "OM": 3, "OTHER": 4, "PH": 5, "PK": 6, "UK": 7, "US": 8}
            religion_map = {"Christian": 0, "Hindu": 1, "Muslim": 2, "Other": 3}
            account_type_map = {"Business": 0, "Joint": 1, "Salary": 2, "Savings": 3}
            yes_no_map = {"Yes": 1, "No": 0}
            risk_tolerance_map = {"High": 2, "Low": 0, "Medium": 1}
            education_map = {"Associate": 0, "Bachelor": 1, "Doctorate": 2, "High School": 3, "Master": 4}
            gender_map = {"Female": 0, "Male": 1, "Other": 2}
            occupation_map = {"Government": 0, "Private": 1, "Retired": 2, "Self-Employed": 3, "Student": 4}
            digital_preference_map = {"Branch": 0, "Mobile": 1, "Web": 2}
            
            features = [
                customer.age or 30,  # 1. Age
                customer.income_omr or 2000.0,  # 2. Income_OMR
                employment_type_map.get(customer.employment_type.value if customer.employment_type else "Salaried", 1),  # 3. Employment_Type
                customer.credit_score or 700,  # 4. Credit_Score
                customer.account_tenure_months or 12,  # 5. Account_Tenure_Months
                marital_status_map.get(customer.marital_status_csv.value if customer.marital_status_csv else "Single", 2),  # 6. Marital_Status
                customer.number_of_children or 0,  # 7. Number_of_Children
                customer.digital_engagement_score or 50,  # 8. Digital_Engagement_Score
                residence_status_map.get(customer.residence_status.value if customer.residence_status else "Rented", 2),  # 9. Residence_Status
                nationality_map.get(customer.nationality.value if customer.nationality else "OM", 3),  # 10. Nationality
                religion_map.get(customer.religion.value if customer.religion else "Muslim", 2),  # 11. Religion
                account_type_map.get(customer.account_type.value if customer.account_type else "Savings", 3),  # 12. Account_Type
                yes_no_map.get(customer.vehicle_owner.value if customer.vehicle_owner else "No", 0),  # 13. Vehicle_Owner
                yes_no_map.get(customer.drivers_license.value if customer.drivers_license else "No", 0),  # 14. Drivers_License
                customer.monthly_groceries_spend or 150.0,  # 15. Monthly_Groceries_Spend
                customer.international_travel_frequency or 1,  # 16. International_Travel_Frequency
                risk_tolerance_map.get(customer.risk_tolerance.value if customer.risk_tolerance else "Medium", 1),  # 17. Risk_Tolerance
                yes_no_map.get(customer.student_status.value if customer.student_status else "No", 0),  # 18. Student_Status
                yes_no_map.get(customer.employer_insurance.value if customer.employer_insurance else "No", 0),  # 19. Employer_Insurance
                customer.debt_to_income or 0.3,  # 20. Debt_to_Income
                yes_no_map.get(customer.business_account_owner.value if customer.business_account_owner else "No", 0),  # 21. Business_Account_Owner
                customer.already_has_products or 0,  # 22. Already_Has_Products
                customer.do_not_need_products or 0,  # 23. Do_Not_Need_Products
                customer.recent_transactions or 10,  # 24. Recent_Transactions
                education_map.get(customer.education_level.value if customer.education_level else "Bachelor", 1),  # 25. Education_Level
                gender_map.get(customer.gender.value if customer.gender else "Male", 1),  # 26. Gender
                occupation_map.get(customer.occupation_sector.value if customer.occupation_sector else "Private", 1),  # 27. Occupation_Sector
                customer.health_score or 75,  # 28. Health_Score
                customer.property_value_omr or 0.0,  # 29. Property_Value_OMR
                customer.vehicle_value_omr or 0.0,  # 30. Vehicle_Value_OMR
                customer.credit_utilization_pct or 25.0,  # 31. Credit_Utilization_Pct
                customer.avg_days_abroad_per_year or 5,  # 32. Avg_Days_Abroad_Per_Year
                digital_preference_map.get(customer.digital_channel_preference.value if customer.digital_channel_preference else "Mobile", 1),  # 33. Digital_Channel_Preference
            ]
            
            return features
            
        except Exception as e:
            logger.error(f"Error preparing features for customer {customer.id}: {str(e)}")
            # Return default features if there's an error
            return [30, 2000.0, 1, 700, 12, 2, 0, 50, 2, 3, 2, 3, 0, 0, 150.0, 1, 1, 0, 0, 0.3, 0, 0, 0, 10, 1, 1, 1, 75, 0.0, 0.0, 25.0, 5, 1]
    
    def predict_recommendations(self, customer: Customer) -> List[Dict[str, Any]]:
        """
        Generate product recommendations for a customer using the ML model
        """
        if self.model is None:
            logger.error("Model not loaded, returning default recommendations")
            return self._get_default_recommendations()
        
        try:
            # Prepare features
            features = self.prepare_customer_features(customer)
            features_array = np.array(features).reshape(1, -1)
            
            # Get predictions (assuming model returns probabilities or scores)
            if hasattr(self.model, 'predict_proba'):
                predictions = self.model.predict_proba(features_array)[0]
            else:
                predictions = self.model.predict(features_array)
            
            # Convert to recommendations
            recommendations = []
            
            # Get top 3 recommendations
            if hasattr(self.model, 'predict_proba'):
                # If we have probabilities, get top 3 products by probability
                top_indices = np.argsort(predictions)[-3:][::-1]
                for idx in top_indices:
                    if predictions[idx] > 0.1:  # Only include if probability > 10%
                        recommendations.append({
                            "product_name": self.product_mappings.get(idx, f"Product {idx}"),
                            "confidence": float(predictions[idx]),
                            "priority": "high" if predictions[idx] > 0.6 else "medium" if predictions[idx] > 0.3 else "low"
                        })
            else:
                # If we have a single prediction, provide related recommendations
                prediction = int(predictions[0]) if hasattr(predictions, '__iter__') else int(predictions)
                main_product = self.product_mappings.get(prediction, "Premium Credit Card")
                recommendations.append({
                    "product_name": main_product,
                    "confidence": 0.85,
                    "priority": "high"
                })
                
                # Add complementary products
                if prediction in [0, 1]:  # Premium products
                    recommendations.extend([
                        {"product_name": "Investment Portfolio", "confidence": 0.7, "priority": "medium"},
                        {"product_name": "Insurance Package", "confidence": 0.6, "priority": "medium"}
                    ])
                elif prediction in [2, 7]:  # Business products
                    recommendations.extend([
                        {"product_name": "Business Credit Line", "confidence": 0.75, "priority": "high"},
                        {"product_name": "Foreign Exchange Service", "confidence": 0.65, "priority": "medium"}
                    ])
                else:  # Standard products
                    recommendations.extend([
                        {"product_name": "Savings Account Plus", "confidence": 0.7, "priority": "medium"},
                        {"product_name": "Personal Loan", "confidence": 0.6, "priority": "low"}
                    ])
            
            return recommendations[:3]  # Return top 3
            
        except Exception as e:
            logger.error(f"Error generating recommendations for customer {customer.id}: {str(e)}")
            return self._get_default_recommendations()
    
    def _get_default_recommendations(self) -> List[Dict[str, Any]]:
        """Return default recommendations when model fails"""
        return [
            {"product_name": "Savings Account Plus", "confidence": 0.6, "priority": "medium"},
            {"product_name": "Premium Credit Card", "confidence": 0.5, "priority": "low"},
            {"product_name": "Personal Loan", "confidence": 0.4, "priority": "low"}
        ]

# Global instance
recommendation_service = RecommendationService()