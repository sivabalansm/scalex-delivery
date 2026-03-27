import { Workflow, actions } from "@botpress/runtime";


export default new Workflow({
	name: "testworkflow",
	description: "testing the queryTableAction",
	handler: async ({}) => {
		const results = await actions.queryTableAction({ query_type: "towers" });
		return { hi: "hihi", results };
	},
});
