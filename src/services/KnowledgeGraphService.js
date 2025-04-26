const logger = require('../utils/logger');

class KnowledgeGraphService {
  constructor() {
    this.knowledgeGraphs = new Map();
    this.prerequisiteMap = {
      'algebra': ['arithmetic'],
      'geometry': ['algebra'],
      'calculus': ['algebra', 'geometry'],
      'trigonometry': ['geometry']
    };
  }

  initializeStudentGraph(studentId) {
    const graph = {
      nodes: {},
      edges: new Set(),
      masteryThreshold: 0.8
    };
    this.knowledgeGraphs.set(studentId, graph);
    return graph;
  }

  getStudentGraph(studentId) {
    return this.knowledgeGraphs.get(studentId) || this.initializeStudentGraph(studentId);
  }

  addConcept(studentId, concept, prerequisites = []) {
    const graph = this.getStudentGraph(studentId);
    
    if (!graph.nodes[concept]) {
      graph.nodes[concept] = {
        attempts: 0,
        successes: 0,
        lastAttempted: null,
        mastery: 0
      };
    }

    prerequisites.forEach(pre => {
      graph.edges.add(`${pre}->${concept}`);
      if (!graph.nodes[pre]) {
        this.addConcept(studentId, pre);
      }
    });
  }

  updateMastery(studentId, concept, isCorrect) {
    const graph = this.getStudentGraph(studentId);
    if (!graph || !graph.nodes[concept]) return;

    const node = graph.nodes[concept];
    node.attempts++;
    node.successes += isCorrect ? 1 : 0;
    node.lastAttempted = new Date();
    
    // Calculate mastery with decay factor
    const decay = this.calculateDecay(node.lastAttempted);
    node.mastery = (node.successes / node.attempts) * decay;

    logger.info(`Updated mastery for student ${studentId}, concept ${concept}: ${node.mastery}`);
  }

  calculateDecay(lastAttemptDate) {
    const daysSince = (new Date() - lastAttemptDate) / (1000 * 60 * 60 * 24);
    return Math.exp(-daysSince / 30); // Exponential decay over 30 days
  }

  getRecommendedConcepts(studentId) {
    const graph = this.getStudentGraph(studentId);
    const recommendations = [];
    const mastered = new Set();

    // Find mastered concepts
    for (const [concept, data] of Object.entries(graph.nodes)) {
      if (data.mastery >= graph.masteryThreshold) {
        mastered.add(concept);
      }
    }

    // Find next concepts where all prerequisites are mastered
    for (const edge of graph.edges) {
      const [from, to] = edge.split('->');
      if (mastered.has(from) && 
          (!graph.nodes[to] || graph.nodes[to].mastery < graph.masteryThreshold)) {
        recommendations.push({
          concept: to,
          readiness: this.calculateReadiness(graph, to),
          prerequisites: this.getPrerequisites(graph, to)
        });
      }
    }

    // Sort by readiness score
    return recommendations.sort((a, b) => b.readiness - a.readiness);
  }

  calculateReadiness(graph, concept) {
    const prereqs = this.getPrerequisites(graph, concept);
    if (prereqs.length === 0) return 1;

    const avgMastery = prereqs.reduce((sum, pre) => {
      return sum + (graph.nodes[pre]?.mastery || 0);
    }, 0) / prereqs.length;

    return avgMastery * 0.7 + Math.random() * 0.3; // Add some randomness
  }

  getPrerequisites(graph, concept) {
    const prereqs = [];
    for (const edge of graph.edges) {
      const [from, to] = edge.split('->');
      if (to === concept) prereqs.push(from);
    }
    return [...new Set(prereqs)]; // Unique prerequisites
  }
}

module.exports = new KnowledgeGraphService(); 