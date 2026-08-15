import { randomUUID } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const sessionCookieName = "jiseong-demo-session";
const sessionIssuer = "jiseong-cleaning-demo";
const sessionAudience = "jiseong-cleaning-web";
const sessionPurpose = "demo-login";
const sessionDurationSeconds = 60 * 60 * 8;

export type DemoSession = {
  userId: string;
  role: "CUSTOMER" | "ADMIN";
};

function getSessionKey() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "SESSION_SECRET 환경변수가 없어 세션을 생성하거나 검증할 수 없습니다.",
    );
  }

  return new TextEncoder().encode(secret);
}

function resolveDemoRole(phone: string): DemoSession["role"] {
  const adminPhone = process.env.DEMO_ADMIN_PHONE;
  return adminPhone && phone === adminPhone ? "ADMIN" : "CUSTOMER";
}

export async function createDemoSession(phone: string) {
  return createSession(resolveDemoRole(phone));
}

export async function createPartnerSession() {
  return createSession("CUSTOMER");
}

async function createSession(role: DemoSession["role"]) {
  const session: DemoSession = {
    userId: randomUUID(),
    role,
  };
  const value = await new SignJWT({
    purpose: sessionPurpose,
    role: session.role,
    userId: session.userId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(sessionIssuer)
    .setAudience(sessionAudience)
    .setIssuedAt()
    .setExpirationTime(`${sessionDurationSeconds}s`)
    .sign(getSessionKey());
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, value, {
    httpOnly: true,
    maxAge: sessionDurationSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return session;
}

export async function getDemoSession(): Promise<DemoSession | null> {
  const value = (await cookies()).get(sessionCookieName)?.value;

  if (!value) {
    return null;
  }

  const sessionKey = getSessionKey();

  try {
    const { payload } = await jwtVerify(value, sessionKey, {
      algorithms: ["HS256"],
      audience: sessionAudience,
      issuer: sessionIssuer,
    });

    if (
      payload.purpose !== sessionPurpose ||
      typeof payload.userId !== "string" ||
      !payload.userId ||
      (payload.role !== "CUSTOMER" && payload.role !== "ADMIN")
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export async function deleteDemoSession() {
  (await cookies()).delete(sessionCookieName);
}
