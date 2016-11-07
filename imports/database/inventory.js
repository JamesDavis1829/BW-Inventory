import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export const Inventory = new Mongo.Collection("inventory");

if(Meteor.isServer){
  Meteor.publish("inventory", function publishDeviceData(){
    return Inventory.find({});
  });

  Inventory.allow({
    insert: function(){
      return true;
    },
    update : function(){
      return true;
    },
    remove : function(){
      return true;
    }
  })
}
