# Backend API Fix for Candidate Status Issue

## Problem
The deployed backend API at `/delegate-candidates/status/:registrationNumber` is not returning the `status` and `adminComments` fields, causing the frontend to display "Status: undefined, Comments: none".

## Root Cause
The deployed backend is using an older version of the code that doesn't include the status and adminComments fields in the API response.

## Solution
The backend route in `routes/delegateCandidates.js` needs to be updated to include these fields in the response.

## Current API Response (Broken)
```json
{
  "isCandidate": true,
  "candidate": {
    "id": "69797ef7140bcc234bfdbe68",
    "manifesto": "",
    "voteCount": 0
  }
}
```

## Expected API Response (Fixed)
```json
{
  "isCandidate": true,
  "candidate": {
    "id": "69797ef7140bcc234bfdbe68",
    "manifesto": "",
    "voteCount": 0,
    "status": "rejected",
    "adminComments": "Rejected due to incomplete manifesto",
    "reviewedAt": "2026-01-28T03:14:32.465Z",
    "appliedAt": "2026-01-28T03:13:59.147Z"
  }
}
```

## Database Verification
The database records are correct and contain the status information:
- Status: "rejected"
- AdminComments: "Rejcted" (for MED/2024/001)
- Status: "rejected" 
- AdminComments: "rejected" (for MED/2024/002)

## Frontend Workaround
The frontend has been updated to:
1. Detect when status information is missing from the API
2. Show a warning message to the user
3. Provide a refresh button
4. Display "UNKNOWN (API Issue)" instead of "undefined"
5. Show appropriate fallback messages

## To Fix Permanently
1. Redeploy the backend with the updated `routes/delegateCandidates.js` file
2. Ensure the `/status/:registrationNumber` endpoint returns all required fields
3. Test the API response to confirm it includes status and adminComments

## Testing
Use this command to test the API:
```bash
curl "https://votingsystem-evg4.onrender.com/api/delegate-candidates/status/MED%2F2024%2F001"
```

The response should include status and adminComments fields.