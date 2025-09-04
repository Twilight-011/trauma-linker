# Backend Integration Guide - Supabase Required

## 🚨 Important: This Application Requires Supabase Integration

The Trauma Linker application is designed as a **frontend React application** that requires **Supabase integration** for all backend functionality including:

- ✅ **Database operations** (patient records, hospital data)
- ✅ **Authentication** (user login/logout, role-based access)
- ✅ **Real-time features** (live updates, notifications)
- ✅ **File storage** (medical images, documents)
- ✅ **AI model deployment** (image analysis, vital signs assessment)
- ✅ **Communication services** (SMS, voice calls via Edge Functions)
- ✅ **External API integrations** (hospital APIs, location services)

## 🔗 How to Activate Backend Functionality

### Step 1: Connect to Supabase
1. **Click the green Supabase button** on the top right of the Lovable interface
2. **Select "Connect to Supabase"** 
3. **Follow the setup wizard** to create or connect your Supabase project

### Step 2: Configure Your Supabase Project

Once connected, Lovable will be able to see and configure:

#### Database Tables
```sql
-- Patient management
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR(50) UNIQUE NOT NULL,
  age INTEGER,
  gender VARCHAR(20),
  -- ... see database/schema/ for full schema
);

-- Hospital information
CREATE TABLE hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  -- ... see database/schema/ for full schema
);
```

#### Row Level Security (RLS)
```sql
-- Secure patient data access
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their assigned cases" 
ON patients FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM case_assignments WHERE case_id = patients.case_id));
```

#### Edge Functions for Backend Logic
```typescript
// AI Image Analysis - deploy as Edge Function
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { imageData } = await req.json()
  
  // AI model processing
  const analysis = await analyzeTraumaImage(imageData)
  
  return new Response(JSON.stringify(analysis), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

#### API Keys and Secrets
Configure these in Supabase Dashboard → Settings → API:
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
GOOGLE_MAPS_API_KEY=your_maps_key
OPENAI_API_KEY=your_openai_key
```

## 🛠️ Current Frontend-Only Implementation

The current codebase includes **mock implementations** and **service stubs** that demonstrate the intended functionality:

### Mock APIs (src/hooks/)
- `useRealLocationAPI.ts` - Simulates GPS and location services
- `useRealHospitalAPI.ts` - Simulates hospital data fetching  
- `useCommunicationAPI.ts` - Simulates SMS and voice calling
- `useEnhancedAI.ts` - Simulates AI image analysis

### Service Layer (backend/ - for reference)
- `backend/api/hospital-api.ts` - Hospital integration service template
- `backend/services/ai/model-service.ts` - AI model service template
- `backend/services/communication/sms-service.ts` - Communication service template

### Database Schema (database/ - for reference)
- `database/schema/patients.sql` - Complete database schema
- Patient tables, hospital tables, emergency cases, audit logging

### AI Models (ai-models/ - for reference)
- `ai-models/medical-analysis/trauma-classifier.py` - Trauma classification model
- `ai-models/vital-analysis/vital-classifier.py` - Vital signs analysis model

## 🔄 Migration Path from Mock to Real Backend

### Phase 1: Supabase Database Setup
1. **Connect Supabase integration**
2. **Import database schema** from `database/schema/`
3. **Configure Row Level Security** policies
4. **Set up authentication** with role-based access

### Phase 2: Deploy Edge Functions
1. **Create AI analysis functions** based on `ai-models/` templates
2. **Deploy communication services** for SMS/voice integration
3. **Set up hospital API integrations** for real-time data
4. **Configure file storage** for medical images

### Phase 3: Update Frontend Hooks
1. **Replace mock hooks** with real Supabase client calls
2. **Implement real-time subscriptions** for live updates
3. **Add error handling** and retry logic
4. **Configure offline capabilities** for field use

## 📋 Integration Checklist

### ✅ Database Setup
- [ ] Patients table with proper RLS
- [ ] Hospitals table with location indexes  
- [ ] Emergency cases tracking
- [ ] Medical assessments storage
- [ ] Communication logs audit trail

### ✅ Authentication Setup
- [ ] Email/password authentication
- [ ] Role-based access control (EMT, Dispatcher, Hospital, Admin)
- [ ] Session management
- [ ] Password reset flows

### ✅ Edge Functions Deployment  
- [ ] AI image analysis function
- [ ] Vital signs assessment function
- [ ] SMS notification function
- [ ] Hospital communication function
- [ ] Location services function

### ✅ External API Integration
- [ ] Twilio for SMS/voice calls
- [ ] Google Maps for location services
- [ ] OpenStreetMap for hospital discovery
- [ ] Hospital management systems APIs

### ✅ File Storage Configuration
- [ ] Medical image storage bucket
- [ ] Secure file access policies
- [ ] Image optimization and processing
- [ ] HIPAA-compliant file handling

## 🔐 Security Considerations

### Data Protection
- **Patient data encryption** at rest and in transit
- **HIPAA compliance** for medical information
- **Audit logging** for all data access
- **Secure API endpoints** with proper authentication

### Access Control
- **Role-based permissions** for different user types
- **Row-level security** for patient data isolation
- **API rate limiting** to prevent abuse
- **Session management** with automatic timeouts

## 📈 Performance Optimization

### Database Optimization
- **Indexed queries** for fast location-based searches
- **Connection pooling** for efficient database use
- **Read replicas** for high-availability reads
- **Backup strategies** for data protection

### Edge Function Performance
- **Warm function instances** to reduce cold starts
- **Efficient AI model loading** with caching
- **Async processing** for non-blocking operations
- **Error handling** with graceful degradation

## 🚀 Deployment Strategy

### Development Environment
```bash
# Local development with Supabase
supabase start
npm run dev
```

### Production Environment
```bash
# Automatic deployment via Lovable + Supabase
# - Database migrations applied automatically
# - Edge functions deployed to global regions  
# - Real-time features enabled globally
# - SSL certificates and CDN configured
```

## 📞 Next Steps

Ready to enable full backend functionality?

1. **Click the green Supabase button** in the top right
2. **Follow the integration setup**
3. **Use the provided schemas and templates**
4. **Test with real data and APIs**

The frontend is already built and ready - just needs the backend integration to unlock all features!