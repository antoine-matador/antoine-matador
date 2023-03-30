const $ = go.GraphObject.make;

diagram =
  $(go.Diagram, "diagramDiv",
    {
      padding: 10,
      layout: $(go.LayeredDigraphLayout,
        {
          direction: 0,
          layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource,
          alignOption: go.LayeredDigraphLayout.AlignAll
        }),
      "undoManager.isEnabled": true
    });

diagram.nodeTemplate =
  new go.Node("Auto")
.add($(go.Shape, "RoundedRectangle", {width: 400, height: 40 })
      .bind("fill", "color"))
.add(new go.TextBlock({ margin: 15})
      .bind("text", "name"));

diagram.linkTemplate =
  $(go.Link,
    $(go.Shape),
    $(go.Shape, { toArrow: "Standard" })
  );

loadGlobalModel()

var is_globalModel = true;
var is_previous = false;
var is_next = false;
var is_parent = false;
var is_child = false;

function showParentNodeRecursive(node) {
  var parents = node.findNodesInto();
  while (parents.next()) {
    var parent = parents.value;
    parent.visible = true;
    showParentNodeRecursive(parent);
  }
}

function showChildNodeRecursive(node) {
  var children = node.findNodesOutOf();
  while (children.next()) {
    var child = children.value;
    child.visible = true;
    showChildNodeRecursive(child);
  }
}

diagram.addDiagramListener("ObjectSingleClicked",
  e => {
    var currentNode = e.subject.part;
    if (is_globalModel) {
    }
    else if (is_previous) {
      var previousNodes = currentNode.findNodesInto();
      diagram.nodes.each(function(n) { n.visible = false; });
      currentNode.visible = true;
      while (previousNodes.next()) {
        previousNodes.value.visible = true;
      };
    }
    else if (is_next) {
      var nextNodes = currentNode.findNodesOutOf();
      diagram.nodes.each(function(n) { n.visible = false; });
      currentNode.visible = true;
      while (nextNodes.next()) {
        nextNodes.value.visible = true;
      };
    }
    else if (is_parent) {
      diagram.nodes.each(function(n) { n.visible = false; });
      currentNode.visible = true;
      showParentNodeRecursive(currentNode);
    }
    else if (is_child) {
      diagram.nodes.each(function(n) { n.visible = false; });
      currentNode.visible = true;
      showChildNodeRecursive(currentNode);
    }
  });

function levenshteinDistance(s1, s2) {
  if (s1.length < s2.length) {
    var temp = s1;
    s1 = s2;
    s2 = temp;
  }
  var m = s1.length;
  var n = s2.length;
  var d = new Array(n + 1);
  for (var j = 0; j <= n; j++) {
    d[j] = j;
  }
  for (var i = 1; i <= m; i++) {
    var prev = i - 1;
    var diag = prev;
    d[0] = i;
    for (var j = 1; j <= n; j++) {
      var cost = (s1.charAt(i - 1) == s2.charAt(j - 1)) ? 0 : 1;
      var min = Math.min(d[j] + 1, d[j - 1] + 1, diag + cost);
      diag = d[j];
      d[j] = min;
    }
  }
  return d[n];
}

function findNodeClosestToName(name) {
  var closestNode = null;
  var closestDistance = Infinity;
  var predicate = function(node) { return true; };
  var nodes = diagram.findNodesByExample({}, predicate);
  nodes.each(function(node) {
    var distance = levenshteinDistance(node.data.name, name);
    if (distance < closestDistance) {
      closestNode = node;
      closestDistance = distance;
    }
  });
  return closestNode;
}

function search() {
  var input = document.getElementById("input").value;
  if (input) {
    var node = findNodeClosestToName(input);
    console.log(input);
    if (node) {
      diagram.centerRect(node.actualBounds);
      node.isSelected = true;
    } else {
      console.log("Node not found");
    }
  }
}

var resetButton = document.getElementById('reset');
resetButton.addEventListener('click', () => {
  is_globalModel = true;
  is_previous = false;
  is_next = false;
  is_parent = false;
  is_child = false;
  loadGlobalModel();
});

var previousButton = document.getElementById('previous');
previousButton.addEventListener('click', () => {
  is_globalModel = false;
  is_previous = true;
  is_next = false;
  is_parent = false;
  is_child = false;
  });

var nextButton = document.getElementById('next');
nextButton.addEventListener('click', () => {
  is_globalModel = false;
  is_previous = false;
  is_next = true;
  is_parent = false;
  is_child = false;
  });

var parentButton = document.getElementById('parent');
parentButton.addEventListener('click', () => {
  is_globalModel = false;
  is_previous = false;
  is_next = false;
  is_parent = true;
  is_child = false;
  });

var childButton = document.getElementById('child');
childButton.addEventListener('click', () => {
  is_globalModel = false;
  is_previous = false;
  is_next = false;
  is_parent = false;
  is_child = true;
  });


function loadGlobalModel() {

      diagram.model = new go.GraphLinksModel([

        // Tables
        { key: "t_AdesaEventsCA",                       name: "Adesa_Ext.AdesaEventsCA",                              color: "lightskyblue" },
        { key: "t_AdesaEventsUS",                       name: "Adesa_Ext.AdesaEventsUS",                              color: "lightskyblue" },
        { key: "t_Adesa_CR_Listing",                    name: "Adesa_Ext.Adesa_CR_Listing",                           color: "lightskyblue" },
        { key: "t_CR_Listings",                         name: "Auction_Listings.CR_Listings",                         color: "lightskyblue" },
        { key: "t_CR_Listings_Archive",                 name: "Auction_Listings.CR_Listings_Archive",                 color: "lightskyblue" },
        { key: "t_Listings",                            name: "Auction_Listings.Listings",                            color: "lightskyblue" },
      	{ key: "t_Listings_Archives",                   name: "Auction_Listings.Listings_Archives",                   color: "lightskyblue" },
      	{ key: "t_manheim_auction",                     name: "auctionbids_ext_mongodb.manheim_auction",              color: "lightskyblue" },
        { key: "t_dealerops_dealer_mapping",            name: "auto_web_extension.dealerops_dealer_mapping",          color: "lightskyblue" },
      	{ key: "t_BuyersLog_Archived",                  name: "BuyersLogs_US_Int_GSheets.Archived",                   color: "lightskyblue" },
      	{ key: "t_BuyersLog_Current",                   name: "BuyersLogs_US_Int_GSheets.Current",                    color: "lightskyblue" },
      	{ key: "t_BuyersLog_Current_Linked",            name: "BuyersLogs_US_Int_GSheets.Current_Linked",             color: "lightskyblue" },
      	{ key: "t_banned_sellers",                      name: "bwad.banned_sellers",                                  color: "lightskyblue" },
      	{ key: "t_View_DNB_Archives_tbl",               name: "bwad.View_DNB_Archives_tbl",                           color: "lightskyblue" },
      	{ key: "t_vhr",                                 name: "bwad_autocheck.vhr",                                   color: "lightskyblue" },
      	{ key: "t_vhr_temp",                            name: "bwad_autocheck.vhr_temp",                              color: "lightskyblue" },
      	{ key: "t_vhr2",                                name: "bwad_autocheck.vhr2",                                  color: "lightskyblue" },
        { key: "t_Adesa_Breakup_tmp_v1",                name: "BWAD_Int.Adesa_Breakup_tmp_v1",                        color: "lightskyblue" },
      	{ key: "t_Adesa_temp",                          name: "BWAD_Int.Adesa_temp",                                  color: "lightskyblue" },
      	{ key: "t_Adesa_Windshield_Criteria",           name: "BWAD_Int.Adesa_Windshield_Criteria",                   color: "lightskyblue" },
      	{ key: "t_BWAD_Cost_Categories_5",              name: "BWAD_Int.BWAD_Cost_Categories_5",                      color: "lightskyblue" },
      	{ key: "t_BWAD_Luxury_Brands",                  name: "BWAD_Int.BWAD_Luxury_Brands",                          color: "lightskyblue" },
      	{ key: "t_BWAD_MechanicalCost",                 name: "BWAD_Int.BWAD_MechanicalCost",                         color: "lightskyblue" },
      	{ key: "t_BWAD_Rules_Average",                  name: "BWAD_Int.BWAD_Rules_Average",                          color: "lightskyblue" },
      	{ key: "t_BWAD_Windshield_Criteria",            name: "BWAD_Int.BWAD_Windshield_Criteria",                    color: "lightskyblue" },
      	{ key: "t_Condition_Mapping",                   name: "BWAD_Int.Condition_Mapping",                           color: "lightskyblue" },
      	{ key: "t_CR_Keywords_LinkedSheet",             name: "BWAD_Int.CR_Keywords_LinkedSheet",                     color: "lightskyblue" },
      	{ key: "t_CR_Keywords_Table",                   name: "BWAD_Int.CR_Keywords_Table",                           color: "lightskyblue" },
      	{ key: "t_Description_Mapping",                 name: "BWAD_Int.Description_Mapping",                         color: "lightskyblue" },
      	{ key: "t_DNB_VAT_lowgrade",                    name: "BWAD_Int.DNB_VAT_lowgrade",                            color: "lightskyblue" },
      	{ key: "t_DNB_VAT_lowgrade_LinkedSheet",        name: "BWAD_Int.DNB_VAT_lowgrade_LinkedSheet",                color: "lightskyblue" },
        { key: "t_Mapping_Adesa_Manheim",               name: "BWAD_Int.Mapping_Adesa_Manheim",                       color: "lightskyblue" },
        { key: "t_Recon_Cost",                          name: "BWAD_Int.Recon_Cost",                                  color: "lightskyblue" },
      	{ key: "t_Severity_Mapping",                    name: "BWAD_Int.Severity_Mapping",                            color: "lightskyblue" },
        { key: "t_preview",                             name: "clearVIN.preview",                                     color: "lightskyblue" },
        { key: "t_CR_machine_learning_rank",            name: "Guest_NILG_BWAD_AI.CR_machine_learning_rank",          color: "lightskyblue" },
        { key: "t_Vehicle_Sales",                       name: "Qlik_Int.Vehicle_Sales",                               color: "lightskyblue" },
        { key: "t_VehicleSales",                        name: "Qlik_Int.VehicleSales",                                color: "lightskyblue" },
        { key: "t_AllAuctionDetail",                    name: "RunLists_Ext.AllAuctionDetail",                        color: "lightskyblue" },
        { key: "t_AuctionDetail",                       name: "RunLists_Ext.AuctionDetail",                           color: "lightskyblue" },
        { key: "t_BuyerNotesV3",                        name: "RunLists_Ext.BuyerNotesV3",                            color: "lightskyblue" },
        { key: "t_Car_Arbitration_All",                 name: "RunLists_Ext.Car_Arbitration_All",                     color: "lightskyblue" },
        { key: "t_Car_Arbitration_Latest",              name: "RunLists_Ext.Car_Arbitration_Latest",                  color: "lightskyblue" },
        { key: "t_CoreInventory",                       name: "RunLists_Ext.CoreInventory",                           color: "lightskyblue" },
        { key: "t_InventoryData",                       name: "VAuto_Ext.InventoryData",                              color: "lightskyblue" },
        { key: "t_SUV_Model_Inventory",                 name: "VAuto_Ext.SUV_Model_Inventory",                        color: "lightskyblue" },
        { key: "t_core",                                name: "vauto_web_extension.core",                             color: "lightskyblue" },
        { key: "t_dealerops_dealer_mapping",            name: "vauto_web_extension.dealerops_dealer_mapping",         color: "lightskyblue" },
        { key: "t_grade",                               name: "vauto_web_extension.grade",                            color: "lightskyblue" },
        { key: "t_make_model",                          name: "vauto_web_extension.make_model",                       color: "lightskyblue" },
        { key: "t_qlik_dealer_mapping",                 name: "vauto_web_extension.qlik_dealer_mapping",              color: "lightskyblue" },
        { key: "t_sales_last90_summary_cache",          name: "vauto_web_extension.sales_last90_summary_cache",       color: "lightskyblue" },
        
        // Views
      	{ key: "v_view_AdesaAuction",                   name: "Adesa_Ext.view_AdesaAuction",                          color: "lightcyan" },
      	{ key: "v_View_Adesa_CR",                       name: "Auction_Listings.View_Adesa_CR",                       color: "lightcyan" },
      	{ key: "v_View_Adesa_CR_New",                   name: "Auction_Listings.View_Adesa_CR_New",                   color: "lightcyan" },
      	{ key: "v_View_CR_Listings",                    name: "Auction_Listings.View_CR_Listings",                    color: "lightcyan" },
      	{ key: "v_View_CR_Listings_Archive",            name: "Auction_Listings.View_CR_Listings_Archive",            color: "lightcyan" },
      	{ key: "v_View_BuyersLog_Main",                 name: "BuyersLogs_US_Int_GSheets.View_BuyersLog_Main",        color: "lightcyan" },
        { key: "v_View_DNB",                            name: "bwad.View_DNB",                                        color: "lightcyan" },
      	{ key: "v_View_DNB_Archives_V1",                name: "bwad.View_DNB_Archives_V1",                            color: "lightcyan" },
      	{ key: "v_View_DNB_Current",                    name: "bwad.View_DNB_Current",                                color: "lightcyan" },
      	{ key: "v_View_Adesa_Cost_Breakup_Canada",      name: "BWAD_Int.View_Adesa_Cost_Breakup_Canada",              color: "lightcyan" },
      	{ key: "v_View_Adesa_Cost_Breakup_US",          name: "BWAD_Int.View_Adesa_Cost_Breakup_US",                  color: "lightcyan" },
      	{ key: "v_View_Adesa_Tire",                     name: "BWAD_Int.View_Adesa_Tire",                             color: "lightcyan" },
      	{ key: "v_View_Repair_Breakup_Cost",            name: "BWAD_Int.View_Repair_Breakup_Cost",                    color: "lightcyan" },
        { key: "v_view_BuyerNotesV3",                   name: "RunLists_Ext.view_BuyerNotesV3",                       color: "lightcyan" },
        { key: "v_view_BuyerNotesV3_DealerWise",        name: "RunLists_Ext.view_BuyerNotesV3_DealerWise",            color: "lightcyan" },
        { key: "v_view_BuyerNotesV3_Statewise",         name: "RunLists_Ext.view_BuyerNotesV3_Statewise",             color: "lightcyan" },
        { key: "v_View_Parse_Series",                   name: "RunLists_Ext.View_Parse_Series",                       color: "lightcyan" },
        { key: "v_corelive",                            name: "vauto_web_extension.corelive",                         color: "lightcyan" },
        { key: "v_qlik_location_dealer_mapping",        name: "vauto_web_extension.qlik_location_dealer_mapping",     color: "lightcyan" },
        { key: "v_sales_last90_info",                   name: "vauto_web_extension.sales_last90_info",                color: "lightcyan" },
        { key: "v_sales_last90_summary",                name: "vauto_web_extension.sales_last90_summary",             color: "lightcyan" },
        { key: "v_sales_last90_totals",                 name: "vauto_web_extension.sales_last90_totals",              color: "lightcyan" },
        
        // Scheduled Queries
        { key: "s_Adesa_Listings_Followup_1",           name: "Adesa_Listings_Followup_1 [3PM]",                              color: "lightyellow" },
        { key: "s_Adesa_Listings_Followup_2",           name: "Adesa_Listings_Followup_2 [7:10AM]",                           color: "lightyellow" },
        { key: "s_Adesa_Listings_Followup_3",           name: "Adesa_Listings_Followup_3 [10:10PM]",                          color: "lightyellow" },
        { key: "s_BuyersLogs_US_Int_Main",              name: "BuyersLogs_US_Int_Main-Current_Linked-to-Permanent [15 min]",  color: "lightyellow" },
        { key: "s_BWAD_Rules_Average_tbl_Update",       name: "BWAD_Rules_Average_tbl_Update [10:54AM]",                      color: "lightyellow" },
        { key: "s_Mapping_Adesa_To_Manheim",            name: "Mapping_Adesa_To_Manheim [5:31AM]",                            color: "lightyellow" },
        { key: "s_Proc_Adesa_Breakup_Tmp_945am",        name: "Proc_Adesa_Breakup_Tmp_(9.45am) [10:45AM]",                    color: "lightyellow" },
        { key: "s_Proc_Adesa_Breakup_Tmp_V1",           name: "Proc_Adesa_Breakup_Tmp_V1 [10:15PM]",                          color: "lightyellow" },
        { key: "s_Proc_Adesa_Breakup_Tmp_V2",           name: "Proc_Adesa_Breakup_Tmp_V2 [7:15AM]",                           color: "lightyellow" },
        { key: "s_Proc_Adesa_CR_Listing",               name: "Proc_Adesa_CR_Listing [5 hours]",                              color: "lightyellow" },
        { key: "s_Proc_Adesa_Temp_939am",               name: "Proc_Adesa_Temp_(9.39 am) [10:42AM]",                          color: "lightyellow" },
        { key: "s_Proc_Cars_ARBITRATION",               name: "Proc_Cars_ARBITRATION [6PM]",                                  color: "lightyellow" },
        { key: "s_Proc_CR_Keywords_tbl",                name: "Proc_CR_Keywords_tbl [9:15PM]",                                color: "lightyellow" },
        { key: "s_Proc_Insert_DNB_VAT_lowgrade",        name: "Proc_Insert_DNB_VAT_lowgrade [7:05AM]",                        color: "lightyellow" },
        { key: "s_Proc_ReconTest",                      name: "Proc_ReconTest [1 hour]",                                      color: "lightyellow" },
        { key: "s_Proc_SUV_Model_Inventory",            name: "Proc_SUV_Model_Inventory [3PM]",                               color: "lightyellow" },
      	{ key: "s_Proc_View_DNB_Archives_tbl",          name: "Proc_View_DNB_Archives_tbl [3 hours]",                         color: "lightyellow" },
        { key: "s_Refresh_Core_Table",                  name: "Refresh Core Table [6 hours]",                                 color: "lightyellow" },
        { key: "s_Refresh_Sales_Last90_Summary_Cache",  name: "Refresh Sales Last90 Summary Cache [6 hours]",                 color: "lightyellow" },
        { key: "s_UpdateBuyerNotesV3",                  name: "UpdateBuyerNotesV3 [7:15AM]",                                  color: "lightyellow" },
        
        // Procedures
        { key: "p_loadCrListingsArchive_v2",            name: "loadCrListingsArchive_v2 [5:30+45AM, 8+30AM, 9:15+40PM]",  color: "lightpink" },
        { key: "p_Proc_Adesa_temp",                     name: "Proc_Adesa_temp",                                          color: "lightpink" },
        { key: "p_proc_BWAD_Rules_Average",             name: "proc_BWAD_Rules_Average",                                  color: "lightpink" },
        { key: "p_Proc_Insert_DNB_VAT_lowgrade",        name: "Proc_Insert_DNB_VAT_lowgrade",                             color: "lightpink" },
        { key: "p_Proc_Get_Recon_Test",                 name: "Proc_Get_Recon_Test",                                      color: "lightpink" },
        { key: "p_proc_loadVhr",                        name: "proc_loadVhr [6:30AM, 9:15PM]",                            color: "lightpink" },
        { key: "p_Proc_SUV_Model_Inventory",            name: "Proc_SUV_Model_Inventory",                                 color: "lightpink" },
        { key: "p_proc_UpdateBuyerNotesV3",             name: "proc_UpdateBuyerNotesV3",                                  color: "lightpink" },
      	{ key: "p_Proc_View_DNB_Archives_tbl",          name: "Proc_View_DNB_Archives_tbl",                               color: "lightpink" },
        { key: "p_procLoadListingArchives",             name: "procLoadListingArchives [5AM, 8:45PM]",                    color: "lightpink" },
        
        // Google Sheets
        { key: "g_Banned_Sellers",                      name: "Banned_Sellers",                                       color: "lightgreen" },
        { key: "g_BuyersLog",                           name: "BuyersLog",                                            color: "lightgreen" },
        { key: "g_Car_Arbitration",                     name: "Car_Arbitration_ARB_Claims",                           color: "lightgreen" },
        { key: "g_Cost_Categories",                     name: "Cost_Categories",                                      color: "lightgreen" },
        { key: "g_CR_Keywords",                         name: "CR_Keywords",                                          color: "lightgreen" },
        { key: "g_Luxury_Brands",                       name: "Luxury_Brands_for_Damage_Prices",                      color: "lightgreen" },
        { key: "g_Mapping_Adesa_Manheim",               name: "Mapping_Adesa_Manheim",                                color: "lightgreen" },
        { key: "g_Mechanical_Cost",                     name: "Mechanical_Cost",                                      color: "lightgreen" },
        { key: "g_VAT_Final",                           name: "VAT-Final",                                            color: "lightgreen" },
        { key: "g_WindshieldReplacement",               name: "WindshieldReplacement",                                color: "lightgreen" },
        
      ], [
        
          // corelive
          { from: "t_qlik_dealer_mapping", to: "v_corelive" },
          { from: "v_sales_last90_info", to: "v_corelive" },
        
          // core
          { from: "v_corelive", to: "s_Refresh_Core_Table" },
          { from: "t_dealerops_dealer_mapping", to: "s_Refresh_Core_Table" },
          { from: "s_Refresh_Core_Table", to: "t_core" },
        
          // View_BuyersLog_Main
          { from: "g_BuyersLog", to: "t_BuyersLog_Current_Linked" },
          { from: "t_BuyersLog_Current_Linked", to: "s_BuyersLogs_US_Int_Main" },
          { from: "s_BuyersLogs_US_Int_Main", to: "t_BuyersLog_Current" },
          { from: "t_BuyersLog_Archived", to: "v_View_BuyersLog_Main" },
          { from: "t_BuyersLog_Current", to: "v_View_BuyersLog_Main" },
        
          // qlik_location_dealer_mapping
          { from: "t_qlik_dealer_mapping", to: "v_qlik_location_dealer_mapping" },
        
          // sales_last90_info
          { from: "t_AuctionDetail", to: "v_sales_last90_info" },
          { from: "t_core", to: "v_sales_last90_info" },
          { from: "t_InventoryData", to: "v_sales_last90_info" },
          { from: "t_make_model", to: "v_sales_last90_info" },
          { from: "t_qlik_dealer_mapping", to: "v_sales_last90_info" },
          { from: "t_Vehicle_Sales", to: "v_sales_last90_info" },
          { from: "t_VehicleSales", to: "v_sales_last90_info" },
          { from: "t_vhr2", to: "v_sales_last90_info" },
          { from: "v_View_BuyersLog_Main", to: "v_sales_last90_info" },
        
          // sales_last90_totals
          { from: "v_qlik_location_dealer_mapping", to: "v_sales_last90_totals" },
          { from: "v_sales_last90_info", to: "v_sales_last90_totals" },
          
          // sales_last90_summary_cache
          { from: "t_grade", to: "v_sales_last90_summary" },
          { from: "v_qlik_location_dealer_mapping", to: "v_sales_last90_summary" },
          { from: "v_sales_last90_info", to: "v_sales_last90_summary" },
          { from: "v_sales_last90_totals", to: "v_sales_last90_summary" },
        
          // sales_last90_summary_cache
          { from: "v_sales_last90_summary", to: "s_Refresh_Sales_Last90_Summary_Cache" },
          { from: "s_Refresh_Sales_Last90_Summary_Cache", to: "t_sales_last90_summary_cache" },
        
          // Listings_Archives
          { from: "t_Listings", to: "p_procLoadListingArchives" },
          { from: "p_procLoadListingArchives", to: "t_Listings_Archives" },
        
          // BWAD_Cost_Categories_5
          { from: "g_Cost_Categories", to: "t_BWAD_Cost_Categories_5" },
        
          // BWAD_Luxury_Brands
          { from: "g_Luxury_Brands", to: "t_BWAD_Luxury_Brands" },
        
          // BWAD_MechanicalCost
          { from: "g_Mechanical_Cost", to: "t_BWAD_MechanicalCost" },
        
          // BWAD_Rules_Average
          { from: "t_CR_machine_learning_rank", to: "s_BWAD_Rules_Average_tbl_Update" },
          { from: "s_BWAD_Rules_Average_tbl_Update", to: "p_proc_BWAD_Rules_Average" },
          { from: "p_proc_BWAD_Rules_Average", to: "t_BWAD_Rules_Average" },
        
          // BWAD_Windshield_Criteria
          { from: "g_WindshieldReplacement", to: "t_BWAD_Windshield_Criteria" },
        
          // Adesa_Windshield_Criteria
          { from: "g_WindshieldReplacement", to: "t_Adesa_Windshield_Criteria" },
        
          // banned_sellers
          { from: "g_Banned_Sellers", to: "t_banned_sellers" },
        
          // vhr
          { from: "t_vhr_temp", to: "p_proc_loadVhr" },
          { from: "p_proc_loadVhr", to: "t_vhr" },
        
          // CR_Keywords_Table
          { from: "g_CR_Keywords", to: "t_CR_Keywords_LinkedSheet" },
          { from: "t_CR_Keywords_LinkedSheet", to: "s_Proc_CR_Keywords_tbl" },
          { from: "s_Proc_CR_Keywords_tbl", to: "p_Proc_CR_Keywords_tbl" },
          { from: "p_Proc_CR_Keywords_tbl", to: "t_CR_Keywords_Table" },
        
          // DNB_VAT_lowgrade
          { from: "g_VAT_Final", to: "t_DNB_VAT_lowgrade_LinkedSheet" },
          { from: "t_DNB_VAT_lowgrade_LinkedSheet", to: "s_Proc_Insert_DNB_VAT_lowgrade" },
          { from: "s_Proc_Insert_DNB_VAT_lowgrade", to: "p_Proc_Insert_DNB_VAT_lowgrade" },
          { from: "p_Proc_Insert_DNB_VAT_lowgrade", to: "t_DNB_VAT_lowgrade" },
        
          // Car_Arbitration_All
          { from: "g_Car_Arbitration", to: "t_Car_Arbitration_Latest" },
          { from: "t_Car_Arbitration_Latest", to: "s_Proc_Cars_ARBITRATION" },
          { from: "s_Proc_Cars_ARBITRATION", to: "t_Car_Arbitration_All" },
        
          // SUV_Model_Inventory
          { from: "t_AllAuctionDetail", to: "s_Proc_SUV_Model_Inventory" },
          { from: "t_InventoryData", to: "s_Proc_SUV_Model_Inventory" },
          { from: "s_Proc_SUV_Model_Inventory", to: "p_Proc_SUV_Model_Inventory" },
          { from: "p_Proc_SUV_Model_Inventory", to: "t_SUV_Model_Inventory" },
        
          // view_AdesaAuction
          { from: "t_AdesaEventsCA", to: "v_view_AdesaAuction" },
          { from: "t_AdesaEventsUS", to: "v_view_AdesaAuction" },
        
          // Mapping_Adesa_Manheim
          { from: "g_Mapping_Adesa_Manheim", to: "t_Condition_Mapping" },
          { from: "g_Mapping_Adesa_Manheim", to: "t_Description_Mapping" },
          { from: "g_Mapping_Adesa_Manheim", to: "t_Severity_Mapping" },
        
          // View_Adesa_CR
          { from: "v_view_AdesaAuction", to: "v_View_Adesa_CR" },
        
          // Mapping_Adesa_Manheim
          { from: "t_Condition_Mapping", to: "s_Mapping_Adesa_To_Manheim" },
          { from: "t_Description_Mapping", to: "s_Mapping_Adesa_To_Manheim" },
          { from: "t_Severity_Mapping", to: "s_Mapping_Adesa_To_Manheim" },
          { from: "v_View_Adesa_CR", to: "s_Mapping_Adesa_To_Manheim" },
          { from: "s_Mapping_Adesa_To_Manheim", to: "t_Mapping_Adesa_Manheim" },
        
          // View_Adesa_CR_New
          { from: "v_view_AdesaAuction", to: "v_View_Adesa_CR_New" },
        
          // Adesa_CR_Listing
          { from: "t_Mapping_Adesa_Manheim", to: "s_Proc_Adesa_CR_Listing" },
          { from: "v_view_AdesaAuction", to: "s_Proc_Adesa_CR_Listing" },
          { from: "v_View_Adesa_CR_New", to: "s_Proc_Adesa_CR_Listing" },
          { from: "s_Proc_Adesa_CR_Listing", to: "t_Adesa_CR_Listing" },
        
          // Adesa_temp
          { from: "t_banned_sellers", to: "s_Adesa_Listings_Followup_1" },
          { from: "t_SUV_Model_Inventory", to: "s_Adesa_Listings_Followup_1" },
          { from: "v_view_AdesaAuction", to: "s_Adesa_Listings_Followup_1" },
          { from: "t_banned_sellers", to: "s_Adesa_Listings_Followup_2" },
          { from: "t_SUV_Model_Inventory", to: "s_Adesa_Listings_Followup_2" },
          { from: "v_view_AdesaAuction", to: "s_Adesa_Listings_Followup_2" },
          { from: "t_banned_sellers", to: "s_Adesa_Listings_Followup_3" },
          { from: "t_SUV_Model_Inventory", to: "s_Adesa_Listings_Followup_3" },
          { from: "v_view_AdesaAuction", to: "s_Adesa_Listings_Followup_3" },
          { from: "t_banned_sellers", to: "s_Proc_Adesa_Temp_939am" },
          { from: "t_SUV_Model_Inventory", to: "s_Proc_Adesa_Temp_939am" },
          { from: "v_view_AdesaAuction", to: "s_Proc_Adesa_Temp_939am" },
          { from: "s_Adesa_Listings_Followup_1", to: "p_Proc_Adesa_temp" },
          { from: "s_Adesa_Listings_Followup_2", to: "p_Proc_Adesa_temp" },
          { from: "s_Adesa_Listings_Followup_3", to: "p_Proc_Adesa_temp" },
          { from: "s_Proc_Adesa_Temp_939am", to: "p_Proc_Adesa_temp" },
          { from: "p_Proc_Adesa_temp", to: "t_Adesa_temp" },
        
          // View_Adesa_Tire
          { from: "v_view_AdesaAuction", to: "v_View_Adesa_Tire" },
        
          // View_Adesa_Cost_Breakup_Canada
          { from: "t_Adesa_CR_Listing", to: "v_View_Adesa_Cost_Breakup_Canada" },
          { from: "t_Adesa_temp", to: "v_View_Adesa_Cost_Breakup_Canada" },
          { from: "t_Adesa_Windshield_Criteria", to: "v_View_Adesa_Cost_Breakup_Canada" },
          { from: "t_AuctionDetail", to: "v_View_Adesa_Cost_Breakup_Canada" },
          { from: "t_BWAD_Cost_Categories_5", to: "v_View_Adesa_Cost_Breakup_Canada" },
          { from: "t_BWAD_Luxury_Brands", to: "v_View_Adesa_Cost_Breakup_Canada" },
          { from: "t_BWAD_Rules_Average", to: "v_View_Adesa_Cost_Breakup_Canada" },
          { from: "v_View_Adesa_Tire", to: "v_View_Adesa_Cost_Breakup_Canada" },
        
          // View_Adesa_Cost_Breakup_US
          { from: "t_Adesa_CR_Listing", to: "v_View_Adesa_Cost_Breakup_US" },
          { from: "t_Adesa_temp", to: "v_View_Adesa_Cost_Breakup_US" },
          { from: "t_Adesa_Windshield_Criteria", to: "v_View_Adesa_Cost_Breakup_US" },
          { from: "t_AuctionDetail", to: "v_View_Adesa_Cost_Breakup_US" },
          { from: "t_BWAD_Cost_Categories_5", to: "v_View_Adesa_Cost_Breakup_US" },
          { from: "t_BWAD_Luxury_Brands", to: "v_View_Adesa_Cost_Breakup_US" },
          { from: "t_BWAD_MechanicalCost", to: "v_View_Adesa_Cost_Breakup_US" },
          { from: "t_BWAD_Rules_Average", to: "v_View_Adesa_Cost_Breakup_US" },
          { from: "v_View_Adesa_Tire", to: "v_View_Adesa_Cost_Breakup_US" },
        
          // Adesa_Breakup_tmp_v1
          { from: "v_View_Adesa_Cost_Breakup_Canada", to: "s_Proc_Adesa_Breakup_Tmp_945am" },
          { from: "v_View_Adesa_Cost_Breakup_Canada", to: "s_Proc_Adesa_Breakup_Tmp_V1" },
          { from: "v_View_Adesa_Cost_Breakup_Canada", to: "s_Proc_Adesa_Breakup_Tmp_V2" },
          { from: "v_View_Adesa_Cost_Breakup_US", to: "s_Proc_Adesa_Breakup_Tmp_945am" },
          { from: "v_View_Adesa_Cost_Breakup_US", to: "s_Proc_Adesa_Breakup_Tmp_V1" },
          { from: "v_View_Adesa_Cost_Breakup_US", to: "s_Proc_Adesa_Breakup_Tmp_V2" },
          { from: "s_Proc_Adesa_Breakup_Tmp_945am", to: "t_Adesa_Breakup_tmp_v1" },
          { from: "s_Proc_Adesa_Breakup_Tmp_V1", to: "t_Adesa_Breakup_tmp_v1" },
          { from: "s_Proc_Adesa_Breakup_Tmp_V2", to: "t_Adesa_Breakup_tmp_v1" },
        
          // View_Repair_Breakup_Cost
          { from: "t_AuctionDetail", to: "v_View_Repair_Breakup_Cost" },
          { from: "t_banned_sellers", to: "v_View_Repair_Breakup_Cost" },
          { from: "t_BWAD_Cost_Categories_5", to: "v_View_Repair_Breakup_Cost" },
          { from: "t_BWAD_Luxury_Brands", to: "v_View_Repair_Breakup_Cost" },
          { from: "t_BWAD_MechanicalCost", to: "v_View_Repair_Breakup_Cost" },
          { from: "t_BWAD_Rules_Average", to: "v_View_Repair_Breakup_Cost" },
          { from: "t_BWAD_Windshield_Criteria", to: "v_View_Repair_Breakup_Cost" },
          { from: "t_Listings", to: "v_View_Repair_Breakup_Cost" },
          { from: "v_View_CR_Listings", to: "v_View_Repair_Breakup_Cost" },
        
          // Recon_Cost
          { from: "t_Adesa_Breakup_tmp_v1", to: "s_Proc_ReconTest" },
          { from: "v_View_Repair_Breakup_Cost", to: "s_Proc_ReconTest" },
          { from: "s_Proc_ReconTest", to: "p_Proc_Get_Recon_Test" },
          { from: "p_Proc_Get_Recon_Test", to: "t_Recon_Cost" },
        
          // View_DNB_Archives_tbl
          { from: "v_View_DNB_Archives_V1", to: "s_Proc_View_DNB_Archives_tbl" },
          { from: "s_Proc_View_DNB_Archives_tbl", to: "p_Proc_View_DNB_Archives_tbl" },
          { from: "p_Proc_View_DNB_Archives_tbl", to: "t_View_DNB_Archives_tbl" },
        
          // View_CR_Listings
          { from: "t_CR_Listings", to: "v_View_CR_Listings" },
          { from: "t_Listings", to: "v_View_CR_Listings" },
        
          // View_CR_Listings_Archive
          { from: "t_CR_Listings", to: "p_loadCrListingsArchive_v2" },
          { from: "t_Listings_Archives", to: "p_loadCrListingsArchive_v2" },
          { from: "p_loadCrListingsArchive_v2", to: "t_CR_Listings_Archive" },
          { from: "t_CR_Listings_Archive", to: "v_View_CR_Listings_Archive" },
          { from: "t_Listings_Archives", to: "v_View_CR_Listings_Archive" },
        
          // View_DNB_Archives_V1
          { from: "t_Listings_Archives", to: "v_View_DNB_Archives_V1" },
          { from: "v_View_CR_Listings_Archive", to: "v_View_DNB_Archives_V1" },
          { from: "t_banned_sellers", to: "v_View_DNB_Archives_V1" },
          { from: "t_vhr", to: "v_View_DNB_Archives_V1" },
          { from: "t_CR_Keywords_Table", to: "v_View_DNB_Archives_V1" },
          { from: "t_DNB_VAT_lowgrade", to: "v_View_DNB_Archives_V1" },
          { from: "t_AuctionDetail", to: "v_View_DNB_Archives_V1" },
          { from: "t_Car_Arbitration_All", to: "v_View_DNB_Archives_V1" },
        
          // View_DNB_Current
          { from: "t_Listings", to: "v_View_DNB_Current" },
          { from: "v_View_CR_Listings", to: "v_View_DNB_Current" },
          { from: "v_View_CR_Listings_Archive", to: "v_View_DNB_Current" },
          { from: "t_banned_sellers", to: "v_View_DNB_Current" },
          { from: "t_vhr", to: "v_View_DNB_Current" },
          { from: "t_CR_Keywords_Table", to: "v_View_DNB_Current" },
          { from: "t_DNB_VAT_lowgrade", to: "v_View_DNB_Current" },
          { from: "t_preview", to: "v_View_DNB_Current" },
          { from: "t_AuctionDetail", to: "v_View_DNB_Current" },
          { from: "t_Car_Arbitration_All", to: "v_View_DNB_Current" },
        
          // View_DNB
          { from: "t_View_DNB_Archives_tbl", to: "v_View_DNB" },
          { from: "v_View_DNB_Current", to: "v_View_DNB" },
        
          // View_Parse_Series
          { from: "t_AuctionDetail", to: "v_View_Parse_Series" },
        
          // view_BuyerNotesV3_DealerWise
          { from: "t_manheim_auction", to: "v_view_BuyerNotesV3_DealerWise" },
          { from: "t_CR_Listings", to: "v_view_BuyerNotesV3_DealerWise" },
          { from: "t_Listings", to: "v_view_BuyerNotesV3_DealerWise" },
          { from: "v_View_DNB", to: "v_view_BuyerNotesV3_DealerWise" },
          { from: "t_Recon_Cost", to: "v_view_BuyerNotesV3_DealerWise" },
          { from: "t_CR_machine_learning_rank", to: "v_view_BuyerNotesV3_DealerWise" },
          { from: "t_AuctionDetail", to: "v_view_BuyerNotesV3_DealerWise" },
          { from: "t_CoreInventory", to: "v_view_BuyerNotesV3_DealerWise" },
          { from: "v_View_Parse_Series", to: "v_view_BuyerNotesV3_DealerWise" },
          { from: "t_InventoryData", to: "v_view_BuyerNotesV3_DealerWise" },
          { from: "t_dealerops_dealer_mapping", to: "v_view_BuyerNotesV3_DealerWise" },
          { from: "t_sales_last90_summary_cache", to: "v_view_BuyerNotesV3_DealerWise" },
        
          // view_BuyerNotesV3_Statewise
          { from: "t_manheim_auction", to: "v_view_BuyerNotesV3_Statewise" },
          { from: "t_CR_Listings", to: "v_view_BuyerNotesV3_Statewise" },
          { from: "t_Listings", to: "v_view_BuyerNotesV3_Statewise" },
          { from: "v_View_DNB", to: "v_view_BuyerNotesV3_Statewise" },
          { from: "t_Recon_Cost", to: "v_view_BuyerNotesV3_Statewise" },
          { from: "t_CR_machine_learning_rank", to: "v_view_BuyerNotesV3_Statewise" },
          { from: "t_AuctionDetail", to: "v_view_BuyerNotesV3_Statewise" },
          { from: "t_CoreInventory", to: "v_view_BuyerNotesV3_Statewise" },
          { from: "v_View_Parse_Series", to: "v_view_BuyerNotesV3_Statewise" },
          { from: "t_InventoryData", to: "v_view_BuyerNotesV3_Statewise" },
          { from: "t_dealerops_dealer_mapping", to: "v_view_BuyerNotesV3_Statewise" },
          { from: "t_sales_last90_summary_cache", to: "v_view_BuyerNotesV3_Statewise" },
          
          // view_BuyerNotesV3
          { from: "v_view_BuyerNotesV3_DealerWise", to: "v_view_BuyerNotesV3" },
          { from: "v_view_BuyerNotesV3_Statewise", to: "v_view_BuyerNotesV3" },
        
          // BuyerNotesV3
          { from: "v_view_BuyerNotesV3", to: "s_UpdateBuyerNotesV3" },
          { from: "s_UpdateBuyerNotesV3", to: "p_proc_UpdateBuyerNotesV3" },
          { from: "p_proc_UpdateBuyerNotesV3", to: "t_BuyerNotesV3" }
        ]);
    }