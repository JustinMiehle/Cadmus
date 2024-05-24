export class Topic {
	constructor(
		public id: string,
		public name: string,
		public prio: string,
	) {}
}

export class Excerpt {
	constructor(
		public party: string,
		public topic: string,
		public excerpt: string,
		public excerptLength: number,
		public election: string,
	) {}
}

export class Program {
	constructor(
		public id: string,
		public url: string,
		public language: string,
		public party: string,
		public election: string,
		public summary: string,
		public createdAt: string,
	) {}
}

export class SessionSummary {
	constructor(
		public id: string,
		public url: string,
		public language: string,
		public parliament: string,
		public summary: string,
		public participants: string[],
		public summaryByParty: string,
		public summaryByPerson: string,
		public shortSummary: string,
		public date: string,
		public createdAt: string,
	) {}
}
