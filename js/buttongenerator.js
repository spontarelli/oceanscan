var BG = {version: 1}

BG.generateVButtonSetForDiv = function (find_item, set_name, name, start_index) {
	var div_id = name + '_set';
	var div = document.getElementById(div_id);
	if (div === null) {
		console.log("Error generating element");
		return 0;
	}

	var generated_count = 0;
	var item_id, label, href;//, image;
	$(find_item).each(function (index) {
			href = $(this).attr("href");
			//image = href.replace("htm", "png");
			label = href.slice(0, -4);
			item_id = name + '_item' + (index + start_index);
			div.innerHTML += '<input type="radio" id="' + item_id + '" name="' + set_name + '" value="' + href + '"/>' + 
							 '<label class="list_item" for="' + item_id + '">' + label + '</label>';
			generated_count++;
	});

	$(div).vbuttonset();

	return generated_count;
}

BG.getRollType = function (lo_name) {
	if (lo_name === "sss") {
		return 0;
	} else if (lo_name === "sbp") {
		return 1;
	}
	return -1;
}

BG.generateVButtonSets = function (find_item, insert_to_item, set_name, names) {
	var insert_to = $(insert_to_item).get(0);
	var insert_to_tab = $(insert_to_item).find("ul").get(0);

	if (insert_to === undefined || insert_to_tab === undefined) {
		console.log(insert_to);
		return;
	}
	var wf_items_count = 0;
	var generated_items_count = 0;
	var find_item_full, roll_type, name, lo_name;
	for (var i = 0; i < names.length; i++) {
		name = names[i];
		lo_name = name.toLowerCase();
		roll_type = BG.getRollType(lo_name);
		if (roll_type === -1)
			continue;
		find_item_full = find_item + "[bissbpfile=" + roll_type + "]";
		if ($(find_item_full).length > 0) {
			//insert_to.innerHTML += '<div id="'+lo_name+'_items" class="tab_item"><div id="'+name+'_set"></div></div>';
			insert_to_tab.innerHTML += '<li><a href="#'+lo_name+'_items" onclick="">'+name+'</a></li>';

			var div_items = document.createElement("div");
			div_items.setAttribute("id", lo_name+"_items");
			div_items.setAttribute("class", "tab_item");
			var div_set = document.createElement("div");
			div_set.setAttribute("id", name+"_set");
			div_items.appendChild(div_set);
			insert_to.appendChild(div_items);

			generated_items_count = BG.generateVButtonSetForDiv(find_item_full, set_name, name, wf_items_count);
			wf_items_count += generated_items_count;
		}
	}
}