import type { EventHandlerRequest, H3Event } from "h3";
import { authTypes, miscTypes } from "~/shared/types";

type SessionData = {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
};

class SessionStore {
    private sessions: Map<string, SessionData> = new Map();

    createSession(
        event: H3Event<EventHandlerRequest>,
        tokens: authTypes.TokenResponse,
        realm: miscTypes.RealmTypes
    ) {
        const accessExpires = new Date(Date.now() + tokens.expires_in * 1000);
        const refreshExpires = new Date(
            Date.now() + tokens.refresh_expires_in * 1000
        );

        const data: SessionData = {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiresIn: accessExpires.getTime(),
        };

        const sessionId = crypto.randomUUID();
        this.sessions.set(sessionId, data);

        setCookie(event, `${realm}_session_id`, sessionId, {
            expires: refreshExpires,
            httpOnly: true,
            secure: true,
            maxAge: tokens.refresh_expires_in,
        });

        return data;
    }

    getSession(
        event: H3Event<EventHandlerRequest>,
        realm: miscTypes.RealmTypes
    ) {
        const cookies = parseCookies(event);
        const sessionId = cookies[`${realm}_session_id`];

        if (!sessionId) throw new Error("Session ID not found");
        if (!this.sessions.has(sessionId)) throw new Error("Session not found");

        return this.sessions.get(sessionId)!;
    }

    destroySession(
        event: H3Event<EventHandlerRequest>,
        realm: miscTypes.RealmTypes
    ) {
        const cookies = parseCookies(event);
        const sessionId = cookies[`${realm}_session_id`];

        if (!sessionId) throw new Error("Session ID not found");
        if (!this.sessions.has(sessionId)) throw new Error("Session not found");

        const session = this.sessions.get(sessionId)!;

        this.sessions.delete(sessionId);
        deleteCookie(event, `${realm}_session_id`);
        return session;
    }

    updateSession(
        event: H3Event<EventHandlerRequest>,
        tokens: authTypes.TokenResponse,
        realm: miscTypes.RealmTypes
    ) {
        const cookies = parseCookies(event);
        const sessionId = cookies[`${realm}_session_id`];

        if (!sessionId) throw new Error("Session ID not found");
        if (!this.sessions.has(sessionId)) throw new Error("Session not found");

        const data = this.sessions.get(sessionId)!;
        const accessExpires = new Date(Date.now() + tokens.expires_in * 1000);
        const refreshExpires = new Date(
            Date.now() + tokens.refresh_expires_in * 1000
        );
        data.accessToken = tokens.access_token;
        data.refreshToken = tokens.refresh_token;
        data.expiresIn = accessExpires.getTime();

        this.sessions.set(sessionId, data);
        setCookie(event, `${realm}_session_id`, sessionId, {
            expires: refreshExpires,
            httpOnly: true,
            secure: true,
            maxAge: tokens.refresh_expires_in,
        });

        return data;
    }
}

export const sessionStore = new SessionStore();
