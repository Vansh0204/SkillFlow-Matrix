import { GraphData } from './types';

export const seedData: GraphData = {
  people: [
    { id: 'p1', name: 'Alex Rivers', role: 'Staff Frontend Engineer' },
    { id: 'p2', name: 'Sarah Chen', role: 'Senior Backend Developer' },
    { id: 'p3', name: 'Jordan Smyth', role: 'Full Stack Engineer' },
    { id: 'p4', name: 'Elena Rodriguez', role: 'Product Designer' },
    { id: 'p5', name: 'Marcus Thorne', role: 'DevOps Specialist' },
    { id: 'p6', name: 'Aisha Khan', role: 'Data Scientist' },
  ],
  skills: [
    { id: 's1', name: 'React / Next.js', category: 'Frontend' },
    { id: 's2', name: 'Tailwind CSS', category: 'Frontend' },
    { id: 's3', name: 'TypeScript', category: 'Languages' },
    { id: 's4', name: 'Node.js', category: 'Backend' },
    { id: 's5', name: 'PostgreSQL', category: 'Backend' },
    { id: 's6', name: 'AWS / Cloud', category: 'DevOps' },
    { id: 's7', name: 'Docker / K8s', category: 'DevOps' },
    { id: 's8', name: 'Python', category: 'Languages' },
    { id: 's9', name: 'PyTorch / ML', category: 'Data Science' },
    { id: 's10', name: 'Figma', category: 'Design' },
  ],
  connections: [
    { personId: 'p1', skillId: 's1', proficiency: 'expert' },
    { personId: 'p1', skillId: 's2', proficiency: 'expert' },
    { personId: 'p1', skillId: 's3', proficiency: 'expert' },
    { personId: 'p1', skillId: 's4', proficiency: 'familiar' },
    
    { personId: 'p2', skillId: 's4', proficiency: 'expert' },
    { personId: 'p2', skillId: 's5', proficiency: 'expert' },
    { personId: 'p2', skillId: 's3', proficiency: 'expert' },
    { personId: 'p2', skillId: 's7', proficiency: 'familiar' },
    
    { personId: 'p3', skillId: 's1', proficiency: 'expert' },
    { personId: 'p3', skillId: 's4', proficiency: 'expert' },
    { personId: 'p3', skillId: 's3', proficiency: 'expert' },
    { personId: 'p3', skillId: 's2', proficiency: 'familiar' },
    
    { personId: 'p4', skillId: 's10', proficiency: 'expert' },
    { personId: 'p4', skillId: 's2', proficiency: 'familiar' },
    { personId: 'p4', skillId: 's1', proficiency: 'learning' },
    
    { personId: 'p5', skillId: 's6', proficiency: 'expert' },
    { personId: 'p5', skillId: 's7', proficiency: 'expert' },
    { personId: 'p5', skillId: 's4', proficiency: 'familiar' },
    { personId: 'p5', skillId: 's3', proficiency: 'learning' },
    
    { personId: 'p6', skillId: 's8', proficiency: 'expert' },
    { personId: 'p6', skillId: 's9', proficiency: 'expert' },
    { personId: 'p6', skillId: 's5', proficiency: 'familiar' },
    { personId: 'p6', skillId: 's3', proficiency: 'familiar' },
  ],
};
