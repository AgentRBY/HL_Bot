import { GuildMember } from 'discord.js';
import { MemberBaseId } from '../typings/MemberModel';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = any> = new (...args: any[]) => T;

export function serviceMixin(...actions: Constructor[]) {
  class BaseClass {}

  actions.forEach((actionClass) => {
    Object.entries(Object.getOwnPropertyDescriptors(actionClass.prototype)).forEach(([name, descriptor]) => {
      if (name === 'constructor') {
        return;
      }

      Object.defineProperty(BaseClass.prototype, name, descriptor);
    });
  });

  return BaseClass;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function insertMethods(target: any, source: Constructor): any {
  Object.getOwnPropertyNames(source.prototype)
    .filter((key) => !['constructor', 'prototype'].includes(key))
    .forEach((key) => {
      target[key] = source.prototype[key];
    });

  return target;
}

export function getMemberBaseId(member: GuildMember): MemberBaseId {
  return `${member.id}-${member.guild.id}`;
}

export function includesInEnum<VariableType, Enum extends Record<string, VariableType>>(
  item: VariableType,
  enumItem: Enum,
): item is Enum[keyof Enum] {
  return Object.values(enumItem).includes(item);
}
