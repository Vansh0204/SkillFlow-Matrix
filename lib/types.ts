export interface Person {
  id: string;
  name: string;
  role: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Connection {
  personId: string;
  skillId: string;
  proficiency: 'learning' | 'familiar' | 'expert';
}

export interface GraphData {
  people: Person[];
  skills: Skill[];
  connections: Connection[];
}
