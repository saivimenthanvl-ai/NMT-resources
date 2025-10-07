import { createContext, useContext, useState } from "react";
import { api, setToken } from "../api";

type Ctx = { authed: boolean; login: (e:string,p:string)=>Promise<void>; signup:(e:string,p:string)=>Promise<void>; logout:()=>void; };
const AuthCtx = createContext<Ctx>({authed:false, async login(){}, async signup(){}, logout(){}});
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({children}:{children:any}) {
  const [authed, setAuthed] = useState(!!localStorage.getItem("token"));
  const login = async (email:string, password:string) => {
    const {access_token} = await api("/auth/login",{method:"POST", body: JSON.stringify({email,password})});
    setToken(access_token); setAuthed(true);
  };
  const signup = async (email:string, password:string) => {
    const {access_token} = await api("/auth/signup",{method:"POST", body: JSON.stringify({email,password})});
    setToken(access_token); setAuthed(true);
  };
  const logout = () => { localStorage.removeItem("token"); setAuthed(false); };
  return <AuthCtx.Provider value={{authed, login, signup, logout}}>{children}</AuthCtx.Provider>;
}
