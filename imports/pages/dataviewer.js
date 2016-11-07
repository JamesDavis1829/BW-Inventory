import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";
import { Inventory } from "../database/inventory.js";
import { Meteor } from "meteor/meteor";
import "./dataviewer.html";

Template.dataviewer.onCreated(function dataviewerCreate(){
  Meteor.subscribe("inventory");
  this.category = new ReactiveVar("All");
  this.id = new ReactiveVar("");
  this.sort = new ReactiveVar({sort:{}})
  $(document).ready(function() {
    $.getScript("materialize/js/materialize.js",function(){
      $("select").material_select();
    });
    //$("select").material_select();
  });
});

Template.dataviewer.helpers({
  getData(){
    if(Template.instance().category.get() === "All"){
      return Inventory.find({}, Template.instance().sort.get());
    }else{
      return Inventory.find({category : Template.instance().category.get()}, Template.instance().sort.get());
    }
  },
  getDataById(mongoId){
    return Inventory.find({_id : mongoId});
  },
  getCategory(){
    return Template.instance().category.get();
  },
  getPrice(entry){
    return +(parseFloat(entry.price) * parseInt(entry.minimumQuantity)).toFixed(2);

  },
  getId(){
    return Template.instance().id.get();
  },
  isId(){
    return Template.instance().id.get() === "";
  },
  isAll(){
    return Template.instance().category.get() === "All";
  }
});

Template.dataviewer.events({
  "submit #submitToDatabase"(event, instance){
    event.preventDefault();

    const target = event.target;

    let partNumber_revision = target.part_number.value;
    let description = target.description.value;
    let vendor_vendorPartNumber = target.vendor.value;
    let price = target.price.value;
    let minimumQuantity = target.minimum_quantity.value;
    let onHand = target.on_hand.value;

    if(partNumber_revision != "", description != "", vendor_vendorPartNumber != "", price != "", minimumQuantity != "", onHand != ""){
      Inventory.insert({partNumber_revision : partNumber_revision, description : description, vendor_vendorPartNumber : vendor_vendorPartNumber, price : price, minimumQuantity : minimumQuantity, onHand : onHand, category : instance.category.get()});

      target.part_number.value = "";
      target.description.value = "";
      target.vendor.value = "";
      target.price.value = "";
      target.minimum_quantity.value = "";
      target.on_hand.value = "";
    }
  },
  "submit #modifyRow"(event, instance){
    event.preventDefault();

    const target = event.target;

    let category = $("input[name=cat]:checked","#modifyRow").val();
    let partNumber_revision = target.change_part_number.value;
    let description = target.change_description.value;
    let vendor_vendorPartNumber = target.change_vendor.value;
    let price = target.change_price.value;
    let minimumQuantity = target.change_minimum_quantity.value;
    let onHand = target.change_on_hand.value;

    if(category != "", partNumber_revision != "", description != "", vendor_vendorPartNumber != "", price != "", minimumQuantity != "", onHand != ""){
      Inventory.update({_id:instance.id.get()}, {$set:{
        partNumber_revision : partNumber_revision,
        description : description,
        vendor_vendorPartNumber : vendor_vendorPartNumber,
        price : price,
        minimumQuantity : minimumQuantity,
        onHand : onHand,
        category : category
      }});

      partNumber_revision = "";
      description = "";
      vendor_vendorPartNumber = "";
      price = "";
      minimumQuantity = "";
      onHand = "";

      instance.id.set("");
    }

  },
  "click #inventoryCategory"(event, instance){
    instance.category.set($(event.target).text());
  },
  "click .tableRowClick"(event, instance){
    instance.id.set(event.target.parentNode.id);
    $(window).scrollTop(0);
  },
  "click #cancelModification"(event, instance){
    event.preventDefault();
    instance.id.set("");
  },
  "click #deleteSelectedRow"(event, instance){
    event.preventDefault();
    Inventory.remove(instance.id.get());
    instance.id.set("");
  },
  "click #submitSearchQuery"(event, instance){
    event.preventDefault();
    let sortSelectType = $("#sortSelectType option:selected").val();
    let sortSelectModifier = $("#sortSelectModifier option:selected").val();

    if(sortSelectType != "" && sortSelectModifier != ""){
      instance.sort.set({sort : {[sortSelectType] : sortSelectModifier}});
    }
  }
});
