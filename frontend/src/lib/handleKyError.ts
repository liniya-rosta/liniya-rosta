export const handleKyError = async (error: unknown, fallbackMessage = "Неизвестная ошибка") => {
    if (error instanceof Error && 'response' in error && error.response instanceof Response) {
        try {
            const serverError = await error.response.json();
            return serverError?.error || fallbackMessage;
        } catch {
            return `Ошибка: ${error.response.status} ${error.response.statusText}`;
        }
    } else if (error instanceof Error) {
        return error.message;
    }

    return fallbackMessage;
};