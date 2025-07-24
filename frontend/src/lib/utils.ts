import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPaginationButtons = (currentPage: number, totalPages: number, maxButtons = 5): (number | string)[] => {
  const buttons: (number | string)[] = [];

  if (totalPages <= maxButtons + 2) {
    for (let i = 1; i <= totalPages; i++) buttons.push(i);
  } else {
    buttons.push(1);

    let left = currentPage - 1;
    let right = currentPage + 1;

    if (currentPage <= 3) {
      left = 2;
      right = 4;
    } else if (currentPage >= totalPages - 2) {
      left = totalPages - 3;
      right = totalPages - 1;
    }

    if (left > 2) buttons.push("...");

    for (let i = left; i <= right; i++) {
      if (i > 1 && i < totalPages) buttons.push(i);
    }

    if (right < totalPages - 1) buttons.push("...");

    buttons.push(totalPages);
  }

  return buttons;
};