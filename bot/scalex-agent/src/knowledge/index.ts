/**
 * TODO: Add your knowledge here
 *
 * This is a placeholder file to initialize the knowledge directory.
 * You can delete this file once you add your own knowledge.
 */

import { Knowledge, DataSource } from "@botpress/runtime";

const fileSource = DataSource.Directory.fromPath("./kb-data/markdown", { 
        filter: (filePath: string) => { return filePath.endsWith(".md") },
});

export default new Knowledge({
        name: "narrativeAdvisoryContext",
        description: "These are the narrative/advisory files — for contextual questions like \"how should I structure an RFP?\" or \"what certifications should my vendor have?",
        sources: [fileSource],
});

