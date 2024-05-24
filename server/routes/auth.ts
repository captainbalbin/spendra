import { Hono } from 'hono'
import { kindeClient, sessionManager } from '../kinde'
import { getUser } from '../kinde'
import { URL } from 'url' // Add this import statement

export const authRoute = new Hono()
  .get('/login', async (context) => {
    const loginUrl = await kindeClient.login(sessionManager(context))
    return context.redirect(loginUrl.toString())
  })
  .get('/register', async (context) => {
    const registerUrl = await kindeClient.register(sessionManager(context))
    return context.redirect(registerUrl.toString())
  })
  .get('/callback', async (context) => {
    const url = new URL(context.req.url)
    await kindeClient.handleRedirectToApp(sessionManager(context), url)
    return context.redirect('/')
  })
  .get('/logout', async (context) => {
    const logoutUrl = await kindeClient.logout(sessionManager(context))
    return context.redirect(logoutUrl.toString())
  })
  .get('/me', getUser, async (context) => {
    const user = context.var.user
    return context.json({ user })
  })
