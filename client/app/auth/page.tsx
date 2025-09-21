"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthPage(){
    const router=useRouter();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("");


    const handleSignup=async (e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        const {error}=await supabase.auth.signUp({
            email,
            password
        });
        setLoading(false);
        if(error) setError(error.message);
        else alert("Check your email for confirmation!");
    };

    const handleLogin=async(e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        const {error}=await supabase.auth.signInWithPassword({
            email,
            password
        });
        setLoading(false);
        if(error) setError(error.message);
        else router.push("/");
    };

    return(
        <div className="max-w-md mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">Login / SignUp</h1>
        <input type="text"
        placeholder="Email"
        className="border w-full p-2 mb-2"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />
        <input type="text"
        placeholder="Password"
        className="border w-full p-2 mb-2"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />
        <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-500 text-white w-full py-2 rounded mb-2"
        >Login</button>
        <button
        onClick={handleSignup}
        disabled={loading}
        className="bg-green-500 text-white w-full py-2 rounded"
        >Signup</button>
        {error &&<p className="text-red-500 mt-2">{error}</p>}
        </div>
    )

}