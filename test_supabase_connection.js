// Test Supabase connection and projects table
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nadxrexpfcpnocnsjjbk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hZHhyZXhwZmNwbm9jbnNqamJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjAwNzMsImV4cCI6MjA2NzAzNjA3M30.5T0hxDZabIJ_mTrtKpra3beb7OwnnvpNcUpuAhd28Mw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('Testing Supabase connection...');
    
    try {
        // Test 1: Check if we can connect
        console.log('1. Testing basic connection...');
        const { data: testData, error: testError } = await supabase
            .from('projects')
            .select('count')
            .limit(1);
        
        if (testError) {
            console.error('Connection test failed:', testError);
            return;
        }
        
        console.log('✅ Connection successful');
        
        // Test 2: Check table structure
        console.log('2. Testing table structure...');
        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .limit(5);
        
        if (projectsError) {
            console.error('Table access failed:', projectsError);
            return;
        }
        
        console.log('✅ Table access successful');
        console.log('Current projects in database:', projects);
        
        // Test 3: Try to insert a test project
        console.log('3. Testing project insertion...');
        const testProject = {
            project_name: 'Test Project',
            project_description: 'This is a test project',
            start_date: '2024-01-01',
            end_date: '2024-12-31',
            status: 'Not Started',
            assigned_role: 'Developer',
            assigned_to: ['test@example.com'],
            priority: 'Medium',
            client_name: 'Test Client',
            project_scope: 'Test scope',
            tech_stack: ['React', 'Node.js'],
            leader_of_project: 'Test Leader'
        };
        
        const { data: insertData, error: insertError } = await supabase
            .from('projects')
            .insert([testProject])
            .select();
        
        if (insertError) {
            console.error('Insert test failed:', insertError);
            return;
        }
        
        console.log('✅ Insert test successful');
        console.log('Inserted project:', insertData);
        
        // Test 4: Clean up test data
        if (insertData && insertData[0]) {
            console.log('4. Cleaning up test data...');
            const { error: deleteError } = await supabase
                .from('projects')
                .delete()
                .eq('id', insertData[0].id);
            
            if (deleteError) {
                console.error('Cleanup failed:', deleteError);
            } else {
                console.log('✅ Cleanup successful');
            }
        }
        
    } catch (error) {
        console.error('Test failed with error:', error);
    }
}

// Run the test
testConnection();

