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
