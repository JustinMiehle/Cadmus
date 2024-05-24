import BatchAddProgramComponent from "@/components/elections/BatchAddProgram";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ElectionApiHelper } from "../api/ElectionApiHelper";
import AddProgramComponent from "../components/elections/AddProgram";
import CompareProgramsTab from "../components/elections/ComparePrograms";
import SideBySideComparisonTab from "../components/elections/SideBySideComparisonTab";
import SingleProgramTab from "../components/elections/SingleProgramTab";
import TopicsTab from "../components/elections/TopicsTab";

const Elections: React.FC = () => {
	const { t, i18n } = useTranslation();
	const [activeTab, setActiveTab] = useState<string>("topics");

	// biome-ignore lint/correctness/useExhaustiveDependencies: on purpose
	useEffect(() => {
		ElectionApiHelper.initializeElections();
	}, [i18n]);

	return (
		<div className="container mx-auto px-4 py-8 relative overflow-hidden">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="flex justify-center space-x-2 p-1 bg-gray-100 rounded-lg">
					<TabsTrigger
						value="topics"
						className="px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-200"
					>
						{t("topicsTab")}
					</TabsTrigger>
					<TabsTrigger
						value="single-program"
						className="px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-200"
					>
						{t("singleProgramTab")}
					</TabsTrigger>
					<TabsTrigger
						value="side-by-side"
						className="px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-200"
					>
						{t("sideBySideTab")}
					</TabsTrigger>
					<TabsTrigger
						value="compare-programs"
						className="px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-200"
					>
						{t("explainDifferencesTab")}
					</TabsTrigger>
					<TabsTrigger
						value="add-program"
						className="px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-200"
					>
						{t("addProgramTab")}
					</TabsTrigger>
					{/* TODO this needs more work <TabsTrigger value="batch-add-programs" className="px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-200">
						{t("batchAddProgramsTab")}
					</TabsTrigger> */}
				</TabsList>
				<TabsContent value="topics">
					<TopicsTab />
				</TabsContent>
				<TabsContent value="single-program">
					<h2 className="text-2xl font-semibold mb-4">
						{t("getSummaryForSingleProgram")}
					</h2>
					<SingleProgramTab />
				</TabsContent>
				<TabsContent value="side-by-side">
					<SideBySideComparisonTab />
				</TabsContent>
				<TabsContent value="compare-programs">
					<CompareProgramsTab />
				</TabsContent>

				<TabsContent value="add-program">
					<h2 className="text-2xl font-semibold mb-4">{t("addNewProgram")}</h2>
					<AddProgramComponent
						onProgramAdded={(program) => console.log(program)}
					/>
				</TabsContent>

				<TabsContent value="batch-add-programs">
					<h2 className="text-2xl font-semibold mb-4">
						{t("BatchAddPrograms")}
					</h2>
					<BatchAddProgramComponent
						onProgramsAdded={(program) => console.log(program)}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Elections;
