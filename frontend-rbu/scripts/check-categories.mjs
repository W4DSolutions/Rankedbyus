
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkCategories() {
    const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name, slug');

    if (error) {
        console.error('Error fetching categories:', error);
        return;
    }

    console.log('Categories found:', categories.length);

    for (const category of categories) {
        const { count, error: countError } = await supabase
            .from('items')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('status', 'approved');

        if (countError) {
            console.error(`Error counting items for ${category.name}:`, countError);
        } else {
            console.log(`${category.name} (${category.slug}): ${count} items`);

            if (process.argv.includes('--contents')) {
                const { data: items } = await supabase
                    .from('items')
                    .select('name')
                    .eq('category_id', category.id)
                    .eq('status', 'approved')
                    .limit(50);

                if (items) {
                    console.log(items.map(i => i.name).join(', '));
                }
            }
        }
    }
}

checkCategories();
