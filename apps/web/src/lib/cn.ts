/** Joins class names and skips falsy ones: cn('btn', isActive && 'btn-active') */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
