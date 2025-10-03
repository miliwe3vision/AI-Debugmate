// services/supabase.js
import { createClient } from '@supabase/supabase-js'

// Supabase credentials (⚠️ move to .env in production)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://nadxrexpfcpnocnsjjbk.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hZHhyZXhwZmNwbm9jbnNqamJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjAwNzMsImV4cCI6MjA2NzAzNjA3M30.5T0hxDZabIJ_mTrtKpra3beb7OwnnvpNcUpuAhd28Mw'

// Only create the client if credentials are valid
let supabase = null
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } else {
    console.warn('Supabase credentials not configured.')
  }
} catch (error) {
  console.error('Error creating Supabase client:', error)
}

export { supabase }

// ===============================
// Database Service
// ===============================
export const databaseService = {
  // -------------------------
  // AUTH MANAGEMENT
  // -------------------------
  async signUp(email, password) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase.auth.signUp({ email, password })
    return { data, error }
  },

  async signIn(email, password) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  },

  async signOut() {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    if (!supabase) return null
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // -------------------------
  // PROJECTS
  // -------------------------
  async getProjects() {
    if (!supabase) return { data: [], error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase.from('projects').select('*')
    return { data, error }
  },

  async getProjectById(id) {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
    return { data, error }
  },

  async createProject(projectData) {
    const { data, error } = await supabase.from('projects').insert([projectData]).select()
    return { data, error }
  },

  async updateProject(id, updates) {
    const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select()
    return { data, error }
  },

  async deleteProject(id) {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    return { error }
  },

  // -------------------------
  // ROLES MANAGEMENT
  // -------------------------
  async getRoles() {
    const { data, error } = await supabase.from('roles').select('*')
    return { data, error }
  },

  async createRole(roleData) {
    const { data, error } = await supabase.from('roles').insert([roleData]).select()
    return { data, error }
  },

  async updateRoleById(id, updates) {
    const { data, error } = await supabase.from('roles').update(updates).eq('id', id).select()
    return { data, error }
  },

  async deleteRoleById(id) {
    const { error } = await supabase.from('roles').delete().eq('id', id)
    return { error }
  },

  // -------------------------
  // USER LOGINS & PERMISSIONS (user_perms table)
  // -------------------------
  async createUserLogin(userLoginData) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase.from('user_perms').insert([userLoginData]).select()
    return { data, error }
  },

  async getAllUserLogins() {
    if (!supabase) return { data: [], error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase.from('user_perms').select('*')
    return { data, error }
  },

  async getUserByEmail(email) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase.from('user_perms').select('*').eq('email', email).single()
    return { data, error }
  },

  async updateUserLoginByEmail(email, updates) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase.from('user_perms').update(updates).eq('email', email).select()
    return { data, error }
  },

  async deleteUserLoginByEmail(email) {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    const { error } = await supabase.from('user_perms').delete().eq('email', email)
    return { error }
  },

  async updateRolePermissions(email, role, permissions) {
    // permissions is JSON (stored in permission_roles column)
    const { data, error } = await supabase
      .from('user_perms')
      .update({ role, permission_roles: permissions })
      .eq('email', email)
      .select()
    return { data, error }
  },

  // -------------------------
  // ANNOUNCEMENTS
  // -------------------------
  async getAnnouncements() {
    const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
    return { data, error }
  },

  async createAnnouncement(announcementData) {
    const { data, error } = await supabase.from('announcements').insert([announcementData]).select()
    return { data, error }
  },

  // -------------------------
  // API MANAGEMENT
  // -------------------------
  async getApis() {
    const { data, error } = await supabase.from('apis').select('*')
    return { data, error }
  },

  async createApi(apiData) {
    const { data, error } = await supabase.from('apis').insert([apiData]).select()
    return { data, error }
  },

  // -------------------------
  // CHATBOT MESSAGES
  // -------------------------
  async saveChatMessage(messageData) {
    const { data, error } = await supabase.from('chat_messages').insert([messageData]).select()
    return { data, error }
  },

  async getChatHistory(userId) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    return { data, error }
  },

  // -------------------------
  // EMPLOYEE LOGIN LOGS
  // -------------------------
  getISTISOString() {
    const now = new Date()
    const istOffset = 330 // minutes
    const istTime = new Date(now.getTime() + istOffset * 60000)
    return istTime.toISOString().replace('Z', '+05:30')
  },

  async logEmployeeLogin({ email, name, password }) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const login_time = this.getISTISOString()
    const { data, error } = await supabase
      .from('employee_login')
      .insert([{ email, name, pass: password, login_time, logout_time: null }])
      .select()
    return { data, error }
  },

  async logEmployeeLogout({ email }) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }

    // find latest login with no logout_time
    const { data: latest, error: fetchError } = await supabase
      .from('employee_login')
      .select('*')
      .eq('email', email)
      .is('logout_time', null)
      .order('login_time', { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !latest) {
      return { data: null, error: fetchError || { message: 'No active login found' } }
    }

    const logout_time = this.getISTISOString()
    const { data, error } = await supabase
      .from('employee_login')
      .update({ logout_time })
      .eq('id', latest.id)
      .select()

    return { data, error }
  }
}