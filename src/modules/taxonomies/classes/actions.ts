'use server';

import { classService } from './services/class.service';
import { revalidatePath } from 'next/cache';

export async function deleteClassAction(id: number) {
    try {
        await classService.delete(id);
        revalidatePath('/admin/classes');
        return { success: true, message: 'Clase eliminada correctamente' };
    } catch (error) {
        return { success: false, message: 'Error al eliminar la clase' };
    }
}

export async function createClassAction(data: { name: string; status: number }) {
    try {
        await classService.create(data);
        revalidatePath('/admin/classes');
        return { success: true, message: 'Clase creada correctamente' };
    } catch (error) {
        return { success: false, message: 'Error al crear la clase' };
    }
}

export async function updateClassAction(id: number, data: { name: string; status: number }) {
    try {
        const response = await classService.update(id, data);
        console.log(response);
        revalidatePath('/admin/classes');
        return { success: true, message: 'Clase actualizada correctamente' };
    } catch (error) {
        return { success: false, message: 'Error al actualizar la clase' };
    }
}
