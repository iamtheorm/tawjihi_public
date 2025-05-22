from sqlalchemy.orm import Session
from .. import models, schemas

def create_campaign(db: Session, campaign: schemas.CampaignCreate):
    db_campaign = models.Campaign(
        product_id=campaign.product_id,
        segment_id=campaign.segment_id,
        schedule_date=campaign.schedule_date,
        notes=campaign.notes
    )
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign
