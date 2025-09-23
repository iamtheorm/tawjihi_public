# Fix 422 Errors for POST /customers/ Endpoint

## Steps to Complete

1. **Update create_customer function** - Add enum mapping logic to convert string values to enum values before creating the customer
2. **Test the endpoint** - Verify that the endpoint now accepts string values and maps them correctly
3. **Verify frontend integration** - Ensure customer creation works from the AddCustomerModal

## Current Status
- [x] Analyzed the issue: Enum field mismatches between frontend strings and backend enums
- [x] Update backend/app/api/endpoints/customers.py with mapping logic
- [x] Update backend/app/schemas/schemas.py to accept strings instead of enums
- [x] Test the changes
- [x] Fixed database enum issue: Added 'IN' to Nationality enum
- [ ] Verify frontend works
