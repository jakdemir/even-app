import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, message, email } = body;

        // Validate input
        if (!type || !message) {
            return NextResponse.json(
                { error: 'Type and message are required' },
                { status: 400 }
            );
        }

        if (!['bug', 'feature', 'general'].includes(type)) {
            return NextResponse.json(
                { error: 'Invalid feedback type' },
                { status: 400 }
            );
        }

        // Get user agent for debugging
        const userAgent = request.headers.get('user-agent') || 'Unknown';

        // Store feedback in database
        const { data, error: dbError } = await supabase
            .from('feedback')
            .insert({
                type,
                message,
                email: email || null,
                user_agent: userAgent
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
            return NextResponse.json(
                { error: 'Failed to store feedback' },
                { status: 500 }
            );
        }

        // Send email notification (only if Resend is configured)
        if (resend) {
            try {
                const typeEmoji = type === 'bug' ? '🐛' : type === 'feature' ? '💡' : '💬';
                const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

                await resend.emails.send({
                    from: 'Even App <feedback@even-app.com>',
                    to: 'support@even-app.com',
                    subject: `${typeEmoji} New ${typeLabel} Feedback - Even App`,
                    html: `
          <h2>New ${typeLabel} Feedback Received</h2>
          <p><strong>Type:</strong> ${typeLabel}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          ${email ? `<p><strong>User Email:</strong> ${email}</p>` : ''}
          <p><strong>User Agent:</strong> ${userAgent}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          <hr>
          <p><small>Feedback ID: ${data.id}</small></p>
        `
                });
            } catch (emailError) {
                // Log email error but don't fail the request
                console.error('Email sending failed:', emailError);
            }
        } else {
            console.log('Resend not configured - skipping email notification');
        }

        return NextResponse.json({ success: true, id: data.id });
    } catch (error) {
        console.error('Feedback API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
