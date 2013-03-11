define(function(require) {

  var simulate = require('../src/event-simulate').simulate;
  var $ = require('$');

  function inherit(r, s, px) {
      var sp = s.prototype;

      function Temp() {
      }

      Temp.prototype = s.prototype;

      r.prototype = new Temp();
      r.contructor = r;
      r.superclass = s;

      if (px) {
        $.extend(r.prototype, px);
      }
  }


  describe('EventSimulate', function() {
      //-------------------------------------------------------------------------
      // Generic Event Test Case
      //-------------------------------------------------------------------------
      var GenericEventTestCase = function(type /*:String*/){
          this.eventType = type;
          this.name = "Event '" + type + "' Tests";
          this.result = null;
          this.element = null;
          this.elementTagName = "div";
      };

      GenericEventTestCase.prototype = {
          init: function() {
              //create the element
              this.element = document.createElement(this.elementTagName);
              document.body.appendChild(this.element);
              
              //reset the result
              this.result = null;
              var that = this;

              this.element["on" + this.eventType] = function() {
                return function(event) {
                  that.handleEvent(event || window.event); 
                } 
              }();
          },
          destory: function() {
              //remove the element
              document.body.removeChild(this.element);
    
              //remove event handler
              this.element["on" + this.eventType] = null;   
          },
          /*
            * Uses to trap and assign the event object for interrogation.
            * @param {Event} event The event object created from the event.
            */
          handleEvent : function(event /*:Event*/) /*:Void*/ {

              if (this.eventType === "submit") {
                  if (event.preventDefault) {
                      event.preventDefault();
                  } else {
                      event.returnValue = false;
                  }
              };

              this.result = event;
          }
      };

      describe('UIEventTestCase', function() {
           
          function UIEventTestCase(type){
              UIEventTestCase.superclass.call(this, type);
              this.elementTagName = (type === "submit") ? "form": "input";
          }

          var change, select, submit;
          before(function() {
              inherit(UIEventTestCase, GenericEventTestCase, {
                  testDefault: function() {
                    //fire the click event
                      simulate(this.element, this.eventType);
                      expect(this.result).to.be.an('object');
                      expect(this.element).to.eql(this.result.target || this.result.srcElement);
                      // test the data coming back
                      expect(this.eventType).to.be(this.result.type);
                      expect(this.result.bubbles).to.be.ok();
                      if (this.eventType === "submit") {
                          expect(this.result.cancelable).to.be.ok();
                      } else {
                          expect(this.result.cancelable).not.to.be.ok();
                      }
                      expect(window).to.be(this.result.view);
                      expect(1).to.be(this.result.detail);
                  }
              });
              change = new UIEventTestCase("change");
              select = new UIEventTestCase("select");
              submit = new UIEventTestCase("submit");
          });

          it('test change', function(done) {
              change.init();
              change.testDefault();
              setTimeout(function() {
                done();
              }, 10);
          });

          it('test select', function(done) {
              select.init();
              select.testDefault();
              setTimeout(function() {
                done();
              }, 10);
          });

          it('test submit', function(done) {
              submit.init();
              submit.testDefault();
              setTimeout(function() {
                done();
              }, 10);
          });

          after(function() {
            change.destory();
            select.destory();
            submit.destory();
          });
      });

      describe('FocusBlurEventTestCase', function() {
      
          //-------------------------------------------------------------------------
          // Focus/Blur Event Test Case
          //-------------------------------------------------------------------------
    
          function FocusBlurEventTestCase(type){
              FocusBlurEventTestCase.superclass.call(this, type);
              this.elementTagName = "input";
          }

          inherit(FocusBlurEventTestCase, GenericEventTestCase, {
             testDefault: function() {
                 //fire the click event
                 simulate(this.element, this.eventType);
    
                 //test the data coming back
                 expect(this.result).to.be.an('object');
                 expect(this.element).to.be.eql(this.result.target || this.result.srcElement);
                 expect(this.eventType).to.be(this.result.type);
                 expect(this.result.bubbles).to.not.be.ok();
                 expect(this.result.cancelable).to.not.be.ok();
                 expect(window).to.be(this.result.view);
                 expect(1).to.be.eql(this.result.detail);
             } 
          });

          var blur, focus;
          before(function(){
              blur = new FocusBlurEventTestCase("blur");
              focus = new FocusBlurEventTestCase("focus");
          });

          it('test blur', function(done) {
            blur.init();
            blur.testDefault();
            setTimeout(function() {
                done();
            });
          });

          it('test focus', function(done) {
            focus.init();
            focus.testDefault();
            setTimeout(function() {
                done();
            });
          });

          after(function() {
            blur.destory();
            focus.destory();
          });
      });
  });

});

