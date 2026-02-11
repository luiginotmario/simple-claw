import { NextResponse } from 'next/server';
import { generateConfig, ConfigInput } from '../../../utils/configGenerator';

interface ProvisionRequest extends ConfigInput {
  email: string;
}

export async function POST(req: Request) {
  try {
    const body: ProvisionRequest = await req.json();
    const { userName, skills, email } = body;

    // Simulate provisioning delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate config
    const config = generateConfig({ userName, skills });
    
    console.log(`Provisioned for ${email} with skills: ${skills.join(', ')}`);
    
    // Simulate Supabase insert (mock)
    // const supabase = createClient();
    // await supabase.from('users').insert({ email, config });

    return NextResponse.json({ 
      success: true, 
      message: 'Provisioned successfully', 
      config: JSON.parse(config)
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to provision' }, { status: 500 });
  }
}
