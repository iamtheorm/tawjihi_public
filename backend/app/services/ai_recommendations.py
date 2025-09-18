import joblib
import pandas as pd
import numpy as np
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import Customer, CustomerRecommendation, Product, Segment
from app.db.database import get_db
import logging
import os

logger = logging.getLogger(__name__)

class AIRecommendationService:
    def __init__(self):
        self.model = None
        self.model_path = os.path.join(os.path.dirname(__file__), "..", "models", "xgmodels2", "xgb_model.pkl")
        self.load_model()
        
        # Product mapping - these should match your model's output classes
        # Updated to match existing products in database
        self.product_mapping = {
            0: "Personal Loan",
            1: "Credit Card",
            2: "Home Loan",
            3: "Car Loan",
            4: "Investment Portfolio",
            5: "Family Protection Insurance",  # Changed from Insurance Policy
            6: "Savings Account Plus",  # Changed from Savings Account
            7: "Business Credit Line",  # Changed from Current Account
            8: "Mutual Funds - Fund 1",  # Changed from Fixed Deposit
            9: "Al Jawhar Credit Card"  # Changed from Foreign Exchange
        }
    
    def load_model(self):
        """Load the trained ML model"""
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                logger.info("AI recommendation model loaded successfully")
            else:
                logger.warning(f"Model file not found at {self.model_path}, using fallback recommendations")
                self.model = None
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            logger.warning("Using fallback recommendation system")
            self.model = None
    
    def prepare_customer_data(self, customer: Customer) -> pd.DataFrame:
        """Prepare customer data for model prediction"""
        try:
            # Convert categorical variables to numerical values
            employment_mapping = {"Retired": 0, "Salaried": 1, "Self-Employed": 2, "Student": 3}
            marital_mapping = {"Divorced": 0, "Married": 1, "Single": 2, "Widowed": 3}
            residence_mapping = {"Family": 0, "Owned": 1, "Rented": 2}
            nationality_mapping = {"BD": 0, "EG": 1, "IN": 2, "OM": 3, "OTHER": 4, "PH": 5, "PK": 6, "UK": 7, "US": 8}
            religion_mapping = {"Christian": 0, "Hindu": 1, "Muslim": 2, "Other": 3}
            account_mapping = {"Business": 0, "Joint": 1, "Salary": 2, "Savings": 3}
            yes_no_mapping = {"Yes": 1, "No": 0}
            risk_mapping = {"High": 2, "Low": 0, "Medium": 1}
            education_mapping = {"Associate": 0, "Bachelor": 1, "Doctorate": 2, "High School": 3, "Master": 4}
            gender_mapping = {"Female": 0, "Male": 1, "Other": 2}
            occupation_mapping = {"Government": 0, "Private": 1, "Retired": 2, "Self-Employed": 3, "Student": 4}
            digital_mapping = {"Branch": 0, "Mobile": 1, "Web": 2}

            # Create feature dictionary
            features = {
                'Age': customer.age or 30,
                'Income_OMR': customer.income_omr or 2000.0,
                'Employment_Type': employment_mapping.get(customer.employment_type.value if customer.employment_type else "Salaried", 1),
                'Credit_Score': customer.credit_score or 700,
                'Account_Tenure_Months': customer.account_tenure_months or 12,
                'Marital_Status': marital_mapping.get(customer.marital_status_csv.value if customer.marital_status_csv else "Single", 2),
                'Number_of_Children': customer.number_of_children or 0,
                'Digital_Engagement_Score': customer.digital_engagement_score or 50,
                'Residence_Status': residence_mapping.get(customer.residence_status.value if customer.residence_status else "Rented", 2),
                'Nationality': nationality_mapping.get(customer.nationality.value if customer.nationality else "OM", 3),
                'Religion': religion_mapping.get(customer.religion.value if customer.religion else "Muslim", 2),
                'Account_Type': account_mapping.get(customer.account_type.value if customer.account_type else "Savings", 3),
                'Vehicle_Owner': yes_no_mapping.get(customer.vehicle_owner.value if customer.vehicle_owner else "No", 0),
                'Drivers_License': yes_no_mapping.get(customer.drivers_license.value if customer.drivers_license else "No", 0),
                'Monthly_Groceries_Spend': customer.monthly_groceries_spend or 150.0,
                'International_Travel_Frequency': customer.international_travel_frequency or 1,
                'Risk_Tolerance': risk_mapping.get(customer.risk_tolerance.value if customer.risk_tolerance else "Medium", 1),
                'Student_Status': yes_no_mapping.get(customer.student_status.value if customer.student_status else "No", 0),
                'Employer_Insurance': yes_no_mapping.get(customer.employer_insurance.value if customer.employer_insurance else "No", 0),
                'Debt_to_Income': customer.debt_to_income or 0.3,
                'Business_Account_Owner': yes_no_mapping.get(customer.business_account_owner.value if customer.business_account_owner else "No", 0),
                'Already_Has_Products': customer.already_has_products or 0,
                'Do_Not_Need_Products': customer.do_not_need_products or 0,
                'Recent_Transactions': customer.recent_transactions or 10,
                'Education_Level': education_mapping.get(customer.education_level.value if customer.education_level else "Bachelor", 1),
                'Gender': gender_mapping.get(customer.gender.value if customer.gender else "Male", 1),
                'Occupation_Sector': occupation_mapping.get(customer.occupation_sector.value if customer.occupation_sector else "Private", 1),
                'Health_Score': customer.health_score or 75,
                'Property_Value_OMR': customer.property_value_omr or 0.0,
                'Vehicle_Value_OMR': customer.vehicle_value_omr or 0.0,
                'Credit_Utilization_Pct': customer.credit_utilization_pct or 25.0,
                'Avg_Days_Abroad_Per_Year': customer.avg_days_abroad_per_year or 5,
                'Digital_Channel_Preference': digital_mapping.get(customer.digital_channel_preference.value if customer.digital_channel_preference else "Mobile", 1)
            }

            return pd.DataFrame([features])

        except Exception as e:
            logger.error(f"Error preparing customer data: {str(e)}")
            raise
    
    def get_recommendations(self, customer: Customer, top_n: int = 3) -> List[Dict[str, Any]]:
        """Generate recommendations for a customer"""
        try:
            if not self.model:
                raise ValueError("Model not loaded")
            
            # Prepare customer data
            customer_features = self.prepare_customer_data(customer)
            
            # Get predictions (assuming the model returns probabilities for each product)
            try:
                # For classification models that return probabilities
                if hasattr(self.model, 'predict_proba'):
                    predictions = self.model.predict_proba(customer_features)[0]
                    # Get top N recommendations with confidence scores, but only for products we have in our mapping
                    valid_indices = [idx for idx in range(len(predictions)) if idx in self.product_mapping]
                    if valid_indices:
                        # Sort valid predictions by confidence
                        valid_predictions = [(idx, predictions[idx]) for idx in valid_indices]
                        valid_predictions.sort(key=lambda x: x[1], reverse=True)
                        top_valid_predictions = valid_predictions[:top_n]

                        recommendations = []
                        for i, (idx, confidence) in enumerate(top_valid_predictions):
                            product_name = self.product_mapping[idx]

                            recommendations.append({
                                'product_name': product_name,
                                'confidence_score': float(confidence),
                                'priority': i + 1,
                                'recommendation_reason': self._generate_reason(customer, product_name, confidence)
                            })
                    else:
                        # No valid predictions, use fallback
                        recommendations = self._fallback_recommendations(customer, top_n)
                        
                # For models that return single predictions
                else:
                    prediction = self.model.predict(customer_features)[0]
                    product_name = self.product_mapping.get(prediction, f"Product_{prediction}")
                    
                    recommendations = [{
                        'product_name': product_name,
                        'confidence_score': 0.8,  # Default confidence
                        'priority': 1,
                        'recommendation_reason': self._generate_reason(customer, product_name, 0.8)
                    }]
                    
            except Exception as model_error:
                logger.error(f"Model prediction error: {str(model_error)}")
                # Fallback to rule-based recommendations
                recommendations = self._fallback_recommendations(customer, top_n)
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            # Return fallback recommendations
            return self._fallback_recommendations(customer, top_n)
    
    def _generate_reason(self, customer: Customer, product_name: str, confidence: float) -> str:
        """Generate a human-readable reason for the recommendation"""
        reasons = {
            "Personal Loan": f"Based on your income of {customer.income_omr} OMR and credit score of {customer.credit_score}",
            "Credit Card": f"Your digital engagement score of {customer.digital_engagement_score} suggests you'd benefit from digital payment solutions",
            "Home Loan": f"With your income level and {customer.account_tenure_months} months of banking history",
            "Car Loan": f"Based on your financial profile and vehicle ownership status",
            "Investment Portfolio": f"Your risk tolerance and income level make you a good candidate for investments",
            "Insurance Policy": f"Recommended based on your age ({customer.age}) and family status",
            "Savings Account": "A fundamental banking product suitable for your financial goals",
            "Current Account": "Ideal for your business and transaction requirements",
            "Fixed Deposit": f"Low-risk investment option aligned with your profile",
            "Foreign Exchange": f"Based on your travel frequency of {customer.international_travel_frequency} trips per year"
        }
        
        return reasons.get(product_name, f"Recommended based on your financial profile (confidence: {confidence:.1%})")
    
    def _fallback_recommendations(self, customer: Customer, top_n: int) -> List[Dict[str, Any]]:
        """Provide rule-based fallback recommendations"""
        recommendations = []
        
        # Rule-based logic for fallback
        if customer.income_omr and customer.income_omr > 2000:
            recommendations.append({
                'product_name': 'Investment Portfolio',
                'confidence_score': 0.7,
                'priority': 1,
                'recommendation_reason': 'High income profile suitable for investment products'
            })
        
        if customer.vehicle_owner and customer.vehicle_owner.value == "No":
            recommendations.append({
                'product_name': 'Car Loan',
                'confidence_score': 0.6,
                'priority': 2,
                'recommendation_reason': 'No current vehicle ownership detected'
            })
        
        if not customer.already_has_products or customer.already_has_products < 2:
            recommendations.append({
                'product_name': 'Credit Card',
                'confidence_score': 0.8,
                'priority': 3,
                'recommendation_reason': 'Limite        d existing product portfolio'
            })
        
        return recommendations[:top_n]

# Global instance
ai_service = AIRecommendationService()