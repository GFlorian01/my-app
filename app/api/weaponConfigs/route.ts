import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('weapon_configs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching configs:', error);
      return NextResponse.json({ error: 'Error obteniendo configuraciones' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newConfig = await request.json();

    // Verificar si el código ya existe
    const { data: existing, error: checkError } = await supabase
      .from('weapon_configs')
      .select('id')
      .eq('weapon_code', newConfig.weaponCode);

    if (checkError) {
      console.error('Error checking for duplicates:', checkError);
      return NextResponse.json({ error: 'Error verificando duplicados' }, { status: 500 });
    }

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Esta build ya está guardada' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('weapon_configs')
      .insert([{
        username: newConfig.username,
        weapon_code: newConfig.weaponCode,
        weapon_type: newConfig.weaponType,
        weapon_name: newConfig.weaponName,
        game_mode: newConfig.gameMode,
        range_type: newConfig.rangeType,
        copy_count: 0
      }])
      .select();

    if (error) {
      console.error('Error inserting config:', error);
      console.error('Error details:', error.details);
      console.error('Error message:', error.message);
      return NextResponse.json({ error: 'Error guardando configuración' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Configuración guardada', config: data[0] });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// Nueva ruta para incrementar el contador de copias
export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json();

    // Obtener el contador actual
    const { data: current, error: fetchError } = await supabase
      .from('weapon_configs')
      .select('copy_count')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching current count:', fetchError);
      return NextResponse.json({ error: 'Error obteniendo contador' }, { status: 500 });
    }

    // Incrementar y actualizar
    const newCount = (current.copy_count || 0) + 1;
    const { data, error } = await supabase
      .from('weapon_configs')
      .update({ copy_count: newCount })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating copy count:', error);
      return NextResponse.json({ error: 'Error actualizando contador' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Contador actualizado', config: data[0] });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}