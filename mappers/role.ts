import { ROLE } from '../config'

export function getGroupRoleId(group: string) {
  switch (group) {
    case 'A':
      return ROLE.GROUP_A
    case 'B':
      return ROLE.GROUP_B
    case 'C':
      return ROLE.GROUP_C
    case 'D':
      return ROLE.GROUP_D
    case 'E':
      return ROLE.GROUP_E
    case 'F':
      return ROLE.GROUP_F
    case 'G':
      return ROLE.GROUP_G
    case 'H':
      return ROLE.GROUP_H
    case 'I':
      return ROLE.GROUP_I
    case 'J':
      return ROLE.GROUP_J
    default:
      console.error('No matched role')
      return null
  }
}