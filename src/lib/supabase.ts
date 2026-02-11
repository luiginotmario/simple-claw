// Mock Supabase Client

export interface User {
  id: string;
  email: string;
}

export const createClient = () => {
  return {
    auth: {
      signUp: async ({ email, password }: { email: string, password?: string }) => {
        // Mock success
        console.log(`Mock SignUp: ${email}`);
        return {
          data: {
            user: { id: 'mock-user-123', email },
            session: { access_token: 'mock-token' }
          },
          error: null
        };
      },
    },
    from: (table: string) => ({
      insert: async (data: any) => {
        console.log(`Mock Insert into ${table}:`, data);
        return { data: [data], error: null };
      },
      select: async () => ({ data: [], error: null })
    })
  };
};
