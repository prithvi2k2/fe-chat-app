import {  NextResponse } from 'next/server';


// This will only run for paths provided in 'matcher' config below, others will be ignored
export async function middleware(req) {
	// HELPER functions
	const pathIs = path => req.nextUrl.pathname.startsWith(path);
	const setPath = path => req.nextUrl.pathname = path;
	const redirect = () => NextResponse.redirect(req.nextUrl); //redirects to given page path, changes url
	const next = () => NextResponse.next(); // Continue and forward req to server, if everything's fine
	
	const jwt = req.cookies.get('jwt');

	if(pathIs('/chat')){
		if(!!!jwt){
            setPath('/');
			return redirect();
        }
    }
	else if(pathIs('/')){
		if(!!jwt){
            setPath('/chat');
			return redirect();
        }
    }
}

// Middleware is executed only when matching paths are requested
export const config = {
	matcher: [
		'/chat',
		'/',
	]
}