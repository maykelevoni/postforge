const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleData() {
  try {
    // Get the test user
    const user = await prisma.user.findUnique({
      where: { email: 'test@postforge.dev' }
    });

    if (!user) {
      console.log('❌ Test user not found. Please register first.');
      return;
    }

    console.log('✅ Found test user:', user.email);

    // Create a sample service
    const service = await prisma.service.upsert({
      where: { id: 'sample-service-1' },
      update: {},
      create: {
        id: 'sample-service-1',
        userId: user.id,
        name: 'Minecraft Video Scripts',
        description: 'I create engaging video scripts and thumbnails for Minecraft creators',
        type: 'video_content',
        deliverables: 'Generate 10 video scripts tailored for [niche] content, plus thumbnail prompts and captions for each video.',
        priceMin: 97,
        priceMax: 197,
        turnaroundDays: 3,
        funnelUrl: 'https://systeme.io/minecraft-scripts-funnel',
        status: 'active'
      }
    });

    console.log('✅ Created service:', service.name);

    // Create sample tickets in different stages
    const tickets = [
      {
        id: 'ticket-new-1',
        clientName: 'John Smith',
        clientEmail: 'john@example.com',
        niche: 'Minecraft tutorials',
        message: 'I need video scripts for my Minecraft tutorial channel. I focus on beginner-friendly content.',
        status: 'new'
      },
      {
        id: 'ticket-quoted-1',
        clientName: 'Sarah Johnson',
        clientEmail: 'sarah@example.com',
        niche: 'Minecraft mods',
        message: 'Looking for someone to write scripts about the latest Minecraft mods. I post 3x per week.',
        status: 'quoted',
        quote: 'Hi Sarah! I\'d love to help you with your Minecraft mod content. Based on your needs, I can provide 10 video scripts per month focusing on the latest and most popular mods.',
        quoteSentAt: new Date()
      },
      {
        id: 'ticket-progress-1',
        clientName: 'Mike Chen',
        clientEmail: 'mike@example.com',
        niche: 'Minecraft building',
        message: 'Need scripts for Minecraft building tutorials and showcases.',
        status: 'in_progress'
      },
      {
        id: 'ticket-delivered-1',
        clientName: 'Emily Davis',
        clientEmail: 'emily@example.com',
        niche: 'Minecraft survival',
        message: 'I need survival tips and tricks content for my YouTube channel.',
        status: 'delivered',
        deliverables: JSON.stringify({
          generated: 'Here are your 10 Minecraft survival video scripts:\n\n1. "5 Essential Survival Tips for Beginners"\n2. "How to Find Diamonds Fast"\n3. "Building Your First Shelter"\n...',
          generatedAt: new Date().toISOString()
        }),
        deliveredAt: new Date()
      }
    ];

    for (const ticket of tickets) {
      await prisma.serviceTicket.upsert({
        where: { id: ticket.id },
        update: {},
        create: {
          ...ticket,
          userId: user.id,
          serviceId: service.id
        }
      });
      console.log('✅ Created ticket:', ticket.clientName, '-', ticket.status);
    }

    console.log('\n🎉 Sample data created successfully!');
    console.log('\n📧 Test User Login:');
    console.log('   URL: http://localhost:3000/sign-in');
    console.log('   Email: test@postforge.dev');
    console.log('   Password: testpassword123');
    console.log('\n🚀 Then go to: http://localhost:3000/services');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleData();