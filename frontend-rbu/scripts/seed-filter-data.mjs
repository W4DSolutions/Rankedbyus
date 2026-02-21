
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
    console.log('Seeding tags...');
    const tags = [
        { name: 'Browser Extension', slug: 'browser-extension', color: '#f59e0b' },
        { name: 'Mobile App', slug: 'mobile-app', color: '#10b981' },
        { name: 'API Available', slug: 'api-available', color: '#8b5cf6' },
        { name: 'Open Source', slug: 'open-source', color: '#3b82f6' },
        { name: 'Enterprise', slug: 'enterprise', color: '#1e293b' }
    ];

    for (const tag of tags) {
        const { data: existing } = await supabase.from('tags').select('id').eq('slug', tag.slug).maybeSingle();
        if (!existing) {
            await supabase.from('tags').insert(tag);
            console.log(`Added tag: ${tag.name}`);
        }
    }

    // Fetch items and tags to link them
    const { data: items } = await supabase.from('items').select('id, name, description').limit(100);
    const { data: allTags } = await supabase.from('tags').select('id, slug');

    if (!items || !allTags) return;

    console.log('Linking items to tags...');
    for (const item of items) {
        // Randomly assign 1-2 tags to each item for testing
        const randomTags = allTags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
        for (const tag of randomTags) {
            const { error } = await supabase.from('item_tags').insert({
                item_id: item.id,
                tag_id: tag.id
            });
            // Just log skip if it already exists
            if (error && !error.message.includes('duplicate key')) {
                // console.log(`Error adding tag ${tag.slug} to ${item.name}: ${error.message}`);
            }
        }
    }
    console.log('Done seeding filter bits!');
}

seed();
