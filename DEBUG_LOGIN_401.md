# Debugging 401 Unauthorized Login Error

## CRITICAL: Where is the 401 happening?

**Please identify which scenario you're experiencing:**

### Scenario A: 401 during login attempt ❌
- You enter email/password and click "Iniciar Sesión"
- You immediately see "Credenciales inválidas" error
- Browser console shows: `❌ Login failed: Credenciales inválidas`
- **Cause**: User not found OR password mismatch

### Scenario B: 401 after successful login ⚠️
- Login appears to work (no error message)
- Browser tries to redirect to `/dashboard`
- You get 401 error or are redirected back to login
- Browser console shows: `✅ Login successful, redirecting to dashboard...`
- **Cause**: Session not being created OR middleware blocking

### Scenario C: 401 on specific API call 🔧
- Login works and you reach dashboard
- Specific API endpoint returns 401
- Example: `/api/taller`, `/api/ordenes`, etc.
- **Cause**: API route can't read session

---

## Quick Diagnostic Commands

Run these to gather information:

```powershell
# 1. Check if demo user exists
docker exec taller-app node check-user.js

# 2. Check environment variables are loaded
docker exec taller-app node -e "console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET (' + process.env.NEXTAUTH_SECRET.length + ' chars)' : 'NOT SET'); console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL); console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET')"

# 3. Test database connection
docker exec taller-app npx prisma db pull

# 4. View recent logs (watch for errors)
docker logs taller-app --tail 100

# 5. Test login with demo user
# Open browser: http://localhost:3000/login
# Email: demo@tallerdemo.cr
# Password: demo123
```

---

## Solution by Scenario

### If Scenario A (Login fails immediately):

**Problem**: User not found or password incorrect

**Solution**:
```powershell
# Verify demo user exists with correct password
docker exec taller-app node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'demo@tallerdemo.cr' },
    include: { taller: true }
  });
  
  if (!user) {
    console.log('❌ Demo user NOT FOUND');
    return;
  }
  
  console.log('✅ Demo user found:', user.email);
  console.log('   Taller:', user.taller.nombre);
  console.log('   Has password hash:', !!user.passwordHash);
  
  // Test password
  const isValid = await bcrypt.compare('demo123', user.passwordHash);
  console.log('   Password test:', isValid ? '✅ VALID' : '❌ INVALID');
}

checkUser().finally(() => prisma.\$disconnect());
"
```

If password is invalid, re-seed the database:
```powershell
docker exec taller-app npx prisma db seed
```

### If Scenario B (Login succeeds but redirect fails):

**Problem**: Session cookie not being set or middleware blocking

**Solution 1 - Check cookies**:
1. Open DevTools (F12) → Application tab → Cookies
2. Look for `next-auth.session-token` cookie
3. Should exist after login with `HttpOnly` flag

**Solution 2 - Check NEXTAUTH_URL**:
```powershell
# Verify NEXTAUTH_URL matches your browser URL
docker exec taller-app printenv NEXTAUTH_URL
# Should be: http://localhost:3000
```

**Solution 3 - Restart container**:
```powershell
docker restart taller-app
Start-Sleep -Seconds 10
docker logs taller-app --tail 50
```

### If Scenario C (Dashboard loads but API returns 401):

**Problem**: API route can't read session (likely the `/api/taller` route I just created)

**Solution - Check session in API route**:

The issue is that `getCurrentTallerId()` throws an error if no session exists. Let me check the API route:

```typescript
// In src/app/api/taller/route.ts
export async function GET(request: NextRequest) {
  try {
    const tallerId = await getCurrentTallerId() // ← This throws if no session
    // ...
  }
}
```

**Fix**: The API route should return 401 gracefully, not throw. But this shouldn't affect login itself.

---

## Most Likely Issue

Based on your description "401 Unauthorized is what I am getting in the login", I suspect **Scenario A** - the login itself is failing.

**Most common causes**:
1. ❌ Demo user doesn't exist (database not seeded)
2. ❌ Password hash is incorrect
3. ❌ Database connection issue
4. ❌ NEXTAUTH_SECRET not loaded

**Quick fix**:
```powershell
# Re-seed database (creates demo user with correct password)
docker exec taller-app npx prisma db seed

# Restart app
docker restart taller-app

# Try login again with:
# Email: demo@tallerdemo.cr
# Password: demo123
```

---

## Enable Verbose Logging

I already enabled `debug: true` in NextAuth config. Now check Docker logs while attempting login:

```powershell
# Terminal 1: Watch logs
docker logs taller-app -f

# Terminal 2: Try login in browser
# Look for these log lines:
# - "prisma:query SELECT User..."
# - "POST /api/auth/callback/credentials"
# - Any error messages
```

---

## Still Not Working?

Please provide:

1. **Which scenario** (A, B, or C) matches your issue
2. **Browser console output** (F12 → Console tab)
3. **Docker logs** during login attempt
4. **Result of diagnostic commands** above

This will help me identify the exact issue.
