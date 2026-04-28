type Rule = 'required' | 'email' | 'phone' | `minLength:${number}`;

interface ValidationResult {
  valid: boolean;
  message: string;
}

// České chybové hlášky — přizpůsobit dle potřeby
const messages: Record<string, string> = {
  required: 'Toto pole je povinné',
  email: 'Zadejte platnou e-mailovou adresu',
  phone: 'Zadejte platné telefonní číslo',
  minLength: 'Minimální počet znaků: ',
};

export function validateField(value: string, rules: Rule[]): ValidationResult {
  const trimmed = value.trim();

  for (const rule of rules) {
    if (rule === 'required' && !trimmed) {
      return { valid: false, message: messages.required };
    }

    if (rule === 'email' && trimmed) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(trimmed)) {
        return { valid: false, message: messages.email };
      }
    }

    if (rule === 'phone' && trimmed) {
      const phoneRe = /^[+]?[\d\s()-]{6,}$/;
      if (!phoneRe.test(trimmed)) {
        return { valid: false, message: messages.phone };
      }
    }

    if (rule.startsWith('minLength:') && trimmed) {
      const min = parseInt(rule.split(':')[1]);
      if (trimmed.length < min) {
        return { valid: false, message: `${messages.minLength}${min}` };
      }
    }
  }

  return { valid: true, message: '' };
}
