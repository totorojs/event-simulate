define(function(require) {

    var simulate = require('../src/event-simulate').simulate;
    var $ = require('$');
  
    var KeyEventTestCase;
  
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
  
        describe('MouseButtonEventTestCase', function() {
            //-------------------------------------------------------------------------
            // MouseButtonEvent Test Case
            //-------------------------------------------------------------------------
      
            function MouseButtonEventTestCase(type /*:String*/){
                MouseButtonEventTestCase.superclass.call(this, type);
            }
  
            inherit(MouseButtonEventTestCase, GenericEventTestCase, {
                //---------------------------------------------------------------------
                // Tests
                //---------------------------------------------------------------------
                        
                /*
                 * Tests with default options.
                 */
                testDefault : function () /*:Void*/{        
                    //fire the click event
                    simulate(this.element, this.eventType);
      
                    //test the data coming back
                    expect(this.result).to.be.an('object');
                    expect(this.element).to.be(this.result.target || this.result.srcElement);
                    expect(this.eventType).to.eql(this.result.type);
                    expect(this.result.bubbles).to.be.ok();
                    expect(this.result.cancelable).to.be.ok();
                    expect(this.result.view).to.be(window);
                    expect(this.result.detail).to.eql(1);
                },
                
                /*
                 * Tests when using the right mouse button.
                 */
                testRightBtn : function () /*:Void*/{        
                    
                    //fire the click event
                    simulate(this.element, this.eventType, { button: 2 });
                    var result = this.result;
      
                    //test the data coming back
                    expect(result).to.be.an('object');
                    expect(this.element).to.be(result.target || result.srcElement);
                    expect(result.type).to.be(this.eventType);
                    expect(result.bubbles).to.be.ok();
                    expect(result.cancelable).to.be.ok();
                    expect(result.view).to.be(window);
  
                    expect(result.detail).to.eql(1);
                },
                
                /*
                 * Tests when using coordinates.
                 */
                testCoords : function () /*:Void*/{        
                    
                    //fire the click event
                    simulate(this.element, this.eventType, { clientX: 100, clientY: 150, screenX: 200, screenY: 250 });
                    var result = this.result;
      
                    //test the data coming back
                    expect(result).to.be.an('object');
                    expect(result.target || result.srcElement).to.be(this.element);
                    expect(result.type).to.eql(this.eventType);
                    expect(result.bubbles).to.be.ok();
                    expect(result.cancelable).to.be.ok();
                    expect(result.view).to.be(window);
                    expect(result.detail).to.eql(1);
                    expect(result.clientX).to.eql(100);
                    expect(result.clientY).to.eql(150);
                    expect(result.screenX).to.eql(200);
                    expect(result.screenY).to.eql(250);
                },
                
                /*
                 * Tests UserAction.click() when using CTRL key.
                 */
                testCtrlKey : function () /*:Void*/{        
                    
                    //fire the click event
                    simulate(this.element, this.eventType, { ctrlKey: true });
                    var result = this.result;
      
                    //test the data coming back
  
                    expect(result).to.be.an('object');
                    expect(result.target || result.srcElement).to.be(this.element);
                    expect(result.type).to.eql(this.eventType);
                    expect(result.bubbles).to.be.ok();
                    expect(result.cancelable).to.be.ok();
                    expect(result.view).to.be(window);
                    expect(result.detail).to.eql(1);
                    
                    //Assert.areEqual(0, this.result.button, "Button is incorrect.");
                    expect(result.ctrlKey).to.be.ok();
                    expect(result.altKey).to.not.be.ok();
                    expect(result.shiftKey).to.not.be.ok();
                    expect(result.metaKey).to.not.be.ok();
                },
                
                /*
                 * Tests when using ALT key.
                 */
                testAltKey : function () /*:Void*/{        
                    
                    //fire the click event
                    simulate(this.element, this.eventType, { altKey: true });
                    var result = this.result;
      
                    //test the data coming back
                    expect(result).to.be.an('object');
                    expect(result.target || result.srcElement).to.be(this.element);
                    expect(result.type).to.eql(this.eventType);
                    expect(result.bubbles).to.be.ok();
                    expect(result.cancelable).to.be.ok();
                    expect(result.view).to.be(window);
                    expect(result.detail).to.eql(1);
  
                    //Assert.areEqual(0, this.result.button, "Button is incorrect.");
                    expect(result.ctrlKey).to.not.be.ok();
                    expect(result.altKey).to.be.ok();
                    expect(result.shiftKey).to.not.be.ok();
                    expect(result.metaKey).to.not.be.ok();
                },
                
                /*
                 * Tests when using Shift key.
                 */
                testShiftKey : function () /*:Void*/{        
                    
                    //fire the click event
                    simulate(this.element, this.eventType, { shiftKey: true });
                    var result = this.result;
      
                    //test the data coming back
                    expect(result).to.be.an('object');
                    expect(result.target || result.srcElement).to.be(this.element);
                    expect(result.type).to.eql(this.eventType);
                    expect(result.bubbles).to.be.ok();
                    expect(result.cancelable).to.be.ok();
                    expect(result.view).to.be(window);
                    expect(result.detail).to.eql(1);
                    
                    //Assert.areEqual(0, this.result.button, "Button is incorrect.");
                    expect(result.ctrlKey).to.not.be.ok();
                    expect(result.altKey).to.not.be.ok();
                    expect(result.shiftKey).to.be.ok();
                    expect(result.metaKey).to.not.be.ok();
                },
                
                /*
                 * Tests when using Meta key.
                 */
                testMetaKey : function () /*:Void*/{        
                    
                    //fire the click event
                    simulate(this.element, this.eventType, { metaKey: true });
                    var result = this.result;
      
                    //test the data coming back
                    expect(result).to.be.an('object');
                    expect(result.target || result.srcElement).to.be(this.element);
                    expect(result.type).to.eql(this.eventType);
                    expect(result.bubbles).to.be.ok();
                    expect(result.cancelable).to.be.ok();
                    expect(result.view).to.be(window);
                    expect(result.detail).to.eql(1);
                    
                    //Assert.areEqual(0, this.result.button, "Button is incorrect.");
                    expect(result.ctrlKey).to.not.be.ok();
                    expect(result.altKey).to.not.be.ok();
                    expect(result.shiftKey).to.not.be.ok();
                    expect(result.metaKey).to.be.ok();
               }  
            });
  
  
            var click, dblclick, mousedown, mouseup;
            before(function() {
                click = new MouseButtonEventTestCase("click");
                //dblclick = new MouseButtonEventTestCase("dblclick");
                mousedown = new MouseButtonEventTestCase("mousedown");
                mouseup = new MouseButtonEventTestCase("mouseup");
            });

            function executeTest(type) {
               type.init();
               type.testDefault();
               type.testRightBtn();
               type.testCoords();
               type.testCtrlKey();
               type.testAltKey();
               type.testShiftKey();
               type.testMetaKey();
            }
  
            it('test click', function(done) {
               executeTest(click);
               setTimeout(function() {
                   click.destory();
                   done(); 
                }, 200);
            });
  
            /**
            it('test dbclick', function(done) {
                executeTest(dblclick);  
                setTimeout(function() {
                    dblclick.destory();
                    done(); 
                }, 1000);
            });
            **/
  
            it('test moduedown', function(done) {
                executeTest(mousedown);  
                setTimeout(function() {
                    done(); 
                }, 100);
            });
  
            it('test mouseup', function(done) {
                executeTest(mouseup);  
                setTimeout(function() {
                    done(); 
                }, 100);
  
            });
  
            after(function() {
               //click.destory(); 
               //dblclick.destory();
               //mousedown.destory();
               //mouseup.destory();
            });
        });
  
        describe('MouseMovementEventTestCase', function() {
         
            //-------------------------------------------------------------------------
            // MouseMovementEvent Test Case
            //-------------------------------------------------------------------------
            
            function MouseMovementEventTestCase(type /*:String*/) {
                MouseMovementEventTestCase.superclass.call(this,type);    
            }
  
            inherit(MouseMovementEventTestCase, GenericEventTestCase, {
                testRelatedTarget : function () /*:Void*/{
                    //fire the click event
                    simulate(this.element, this.eventType, { relatedTarget: document.body });
                    var result = this.result;
      
                    //test the data coming back
                    expect(result).to.be.an('object');
                    expect(result.target || result.srcElement).to.be(this.element);
                    expect(result.type).to.eql(this.eventType);
                    expect(result.bubbles).to.be.ok();
                    expect(result.cancelable).to.be.ok();
                    expect(result.view).to.be(window);
                    expect(result.detail).to.eql(1);
                    
                    //Assert.areEqual(0, this.result.button, "Button is incorrect.");
  
                    expect(result.ctrlKey).to.not.be.ok();
                    expect(result.altKey).to.not.be.ok();
                    expect(result.shiftKey).to.not.be.ok();
                    expect(result.metaKey).to.not.be.ok();
  
                    expect(result.relatedTarget || result.formElement || result.toElement).to.be(document.body);
                }
            });
  
            var mouseover, mouseout;
            before(function() {
                mouseover = new MouseMovementEventTestCase("mouseover");
                mouseout = new MouseMovementEventTestCase("mouseout");
            });
  
            it('test mouseover', function(done) {
                mouseover.init();
                mouseover.testRelatedTarget();
                setTimeout(function() {
                    done(); 
                }, 100);
            });
  
            it('test mouseout', function(done) {
                mouseout.init();
                mouseout.testRelatedTarget();
                setTimeout(function() {
                    done(); 
                }, 100);
            });
  
            after(function() {
                mouseover.destory();
                mouseout.destory();
            });
        });
  
        //-------------------------------------------------------------------------
        // KeyEvent Test Case
        //-------------------------------------------------------------------------
        var KeyEventTestCase = function(type /*:String*/) {
            KeyEventTestCase.superclass.call(this,type);
        }
  
        inherit(KeyEventTestCase, GenericEventTestCase, {
        
            /*
             * Tests that the default properties are correct.
             */
            testDefault : function () /*:Void*/{
            
                //fire the click event
                simulate(this.element, this.eventType);
                var result = this.result;
      
  
                //test the data coming back
                expect(result).to.be.an('object');
                expect(result.target || result.srcElement).to.be(this.element);
                expect(result.type).to.eql(this.eventType);
                expect(result.bubbles).to.be.ok();
                expect(result.cancelable).to.be.ok();
  
                expect(result.ctrlKey).to.not.be.ok();
                expect(result.altKey).to.not.be.ok();
                expect(result.shiftKey).to.not.be.ok();
                expect(result.metaKey).to.not.be.ok();
            },
            
            /*
             * Tests UserAction.click() when using CTRL key.
             */
            testCtrlKey : function () /*:Void*/{        
                
                //fire the click event
                simulate(this.element, this.eventType, { ctrlKey: true });
                var result = this.result;
  
                // test the data coming back
                expect(result).to.be.an('object');
                expect(result.target || result.srcElement).to.be(this.element);
                expect(result.type).to.eql(this.eventType);
                expect(result.bubbles).to.be.ok();
                expect(result.cancelable).to.be.ok();
  
                expect(result.ctrlKey).to.be.ok();
                expect(result.altKey).to.not.be.ok();
                expect(result.shiftKey).to.not.be.ok();
                expect(result.metaKey).to.not.be.ok();
            }, 
            /*
             * Tests when using ALT key.
             */
            testAltKey : function () /*:Void*/{        
                
                //fire the click event
                simulate(this.element, this.eventType, { altKey: true });
                var result = this.result;
      
                //test the data coming back
                expect(result).to.be.an('object');
                expect(result.target || result.srcElement).to.be(this.element);
                expect(result.type).to.eql(this.eventType);
                expect(result.bubbles).to.be.ok();
                expect(result.cancelable).to.be.ok();
  
                expect(result.ctrlKey).to.not.be.ok();
                expect(result.altKey).to.be.ok();
                expect(result.shiftKey).to.not.be.ok();
                expect(result.metaKey).to.not.be.ok();
            }, 
            /*
             * Tests when using Shift key.
             */
            testShiftKey : function () /*:Void*/{        
                
                //fire the click event
                simulate(this.element, this.eventType, { shiftKey: true });
                var result = this.result;
      
                //test the data coming back
                expect(result).to.be.an('object');
                expect(result.target || result.srcElement).to.be(this.element);
                expect(result.type).to.eql(this.eventType);
                expect(result.bubbles).to.be.ok();
                expect(result.cancelable).to.be.ok();
  
                expect(result.ctrlKey).to.not.be.ok();
                expect(result.altKey).to.not.be.ok();
                expect(result.shiftKey).to.be.ok();
                expect(result.metaKey).to.not.be.ok();
            },
            
            /*
             * Tests when using Meta key.
             */
            testMetaKey : function () /*:Void*/{        
                
                //fire the click event
                simulate(this.element, this.eventType, { metaKey: true });
                var result = this.result;
      
                //test the data coming back
                expect(result).to.be.an('object');
                expect(result.target || result.srcElement).to.be(this.element);
                expect(result.type).to.eql(this.eventType);
                expect(result.bubbles).to.be.ok();
                expect(result.cancelable).to.be.ok();
  
                expect(result.ctrlKey).to.not.be.ok();
                expect(result.altKey).to.not.be.ok();
                expect(result.shiftKey).to.not.be.ok();
                expect(result.metaKey).to.be.ok();
            }            
        });
  
        describe('KeyDirectionEventTestCase', function() {
        
            //-------------------------------------------------------------------------
            // KeyDirection Test Case
            //-------------------------------------------------------------------------    
            
            function KeyDirectionEventTestCase(type /*:String*/){
                KeyDirectionEventTestCase.superclass.call(this, type);
            }
  
            inherit(KeyDirectionEventTestCase, KeyEventTestCase, {
            
              /*
               * Tests that the default properties are correct.
               */
              testKeyCode : function () /*:Void*/{
              
                  //fire the click event
                  simulate(this.element, this.eventType, { keyCode: 97 });
                  var result = this.result;
  
                  expect(result).to.be.an('object');
                  expect(result.target || result.srcElement).to.be(this.element);
                  expect(result.type).to.eql(this.eventType);
                  expect(result.bubbles).to.be.ok();
                  expect(result.cancelable).to.be.ok();
  
                  expect(result.ctrlKey).to.not.be.ok();
                  expect(result.altKey).to.not.be.ok();
                  expect(result.shiftKey).to.not.be.ok();
                  expect(result.metaKey).to.not.be.ok();
                  
                  expect(result.keyCode).to.eql(97);
              }
            });
  
            var keyup, keydown;
            before(function() {
                keyup = new KeyDirectionEventTestCase("keyup");
                keydown = new KeyDirectionEventTestCase("keydown");
            });
  
            it('test keyup', function(done) {
                keyup.init();
                keyup.testKeyCode();
                setTimeout(function() {
                    done();
                }, 100);
            });
  
            it('test keydown', function(done) {
                keydown.init();
                //keydown.testKeyCode();
                setTimeout(function() {
                    done();
                }, 100);
            });
  
            after(function() {
                keyup.destory();
                keydown.destory();
            });
          
        });
  
        describe('TextEventTestCase', function() {
            //-------------------------------------------------------------------------
            // TextEvent Test Case
            //-------------------------------------------------------------------------
            
            function TextEventTestCase(type /*:String*/){
                TextEventTestCase.superclass.call(this, type);
            }
  
            inherit(TextEventTestCase, KeyEventTestCase, {
            
                /*
                 * Tests that the default properties are correct.
                 */
                testCharCode : function () /*:Void*/{
                
                    //fire the click event
                    simulate(this.element, this.eventType, { charCode: 97 });
                    var result = this.result;
  
                    expect(result).to.be.an('object');
                    expect(result.target || result.srcElement).to.be(this.element);
                    expect(result.type).to.eql(this.eventType);
                    expect(result.bubbles).to.be.ok();
                    expect(result.cancelable).to.be.ok();
  
                    expect(result.ctrlKey).to.not.be.ok();
                    expect(result.altKey).to.not.be.ok();
                    expect(result.shiftKey).to.not.be.ok();
                    expect(result.metaKey).to.not.be.ok();
                    
                    expect(result.charCode || result.keyCode).to.eql(97);
                }
            });
  
            var keypress;
            before(function() {
                keypress = new TextEventTestCase("keypress");
            });
  
            it('test keypress', function(done){
                keypress.init();
                keypress.testCharCode();
                setTimeout(function() {
                    done();
                });
            });
  
            after(function() {
                keypress.destory();
            });
        });
    });
});

