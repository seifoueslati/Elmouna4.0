<?php


if(!isset($_SESSION)) 
{ 
	session_start(); 
} 

if($_SESSION['type']=='0')
{


?>























	<div class="left-side-bar">
		<div class="brand-logo">
			<a href="index.php">
			
			</a>
		</div>
		<div class="menu-block customscroll">
			<div class="sidebar-menu">
				<ul id="accordion-menu">
					<li class="dropdown">
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-home"></span><span class="mtext">Home</span>
						</a>
						<ul class="submenu">
							<li><a href="index.php">Live </a></li>
							
						</ul>
					</li>
					<li class="dropdown"  >
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-pencil"></span><span class="mtext">Forms</span>
						</a>
						<ul class="submenu">
							<li><a href="form-basic.php">Add Task</a></li>
							<li><a href="advanced-components.php">Add Product</a></li>
							<li><a href="addworkerform.php">Add Worker</a></li>
						
						</ul>
					</li>
					<li class="dropdown">
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-table"></span><span class="mtext">ALL Tables</span>
						</a>
						<ul class="submenu">
							<li><a href="basic-table.php" hidden >Basic Tables</a></li>
							<li><a href="datatable.php">Tasks Table</a></li>
							<li><a href="datatable2.php">Worker Table</a></li>
						</ul>
					</li>
					<li>
						<a href="calendar.php" class="dropdown-toggle no-arrow" hidden>
							<span class="fa fa-calendar-o"></span><span class="mtext">Calendar</span>
						</a>
					</li>
					<li hidden class="dropdown">
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-desktop"></span><span class="mtext" hidden> UI Elements </span>
						</a>
						<ul class="submenu">
							<li><a href="ui-buttons.php">Buttons</a></li>
							<li><a href="ui-cards.php">Cards</a></li>
							<li><a href="ui-cards-hover.php">Cards Hover</a></li>
							<li><a href="ui-modals.php">Modals</a></li>
							<li><a href="ui-tabs.php">Tabs</a></li>
							<li><a href="ui-tooltip-popover.php">Tooltip &amp; Popover</a></li>
							<li><a href="ui-sweet-alert.php">Sweet Alert</a></li>
							<li><a href="ui-notification.php">Notification</a></li>
							<li><a href="ui-timeline.php">Timeline</a></li>
							<li><a href="ui-progressbar.php">Progressbar</a></li>
							<li><a href="ui-typography.php">Typography</a></li>
							<li><a href="ui-list-group.php">List group</a></li>
							<li><a href="ui-range-slider.php">Range slider</a></li>
							<li><a href="ui-carousel.php">Carousel</a></li>
						</ul>
					</li>
					<li hidden class="dropdown">
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-paint-brush"></span><span class="mtext">Icons</span>
						</a>
						<ul class="submenu">
							<li><a href="font-awesome.php">FontAwesome Icons</a></li>
							<li><a href="foundation.php">Foundation Icons</a></li>
							<li><a href="ionicons.php">Ionicons Icons</a></li>
							<li><a href="themify.php">Themify Icons</a></li>
						</ul>
					</li>
					<li class="dropdown">
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-plug"></span><span class="mtext">Configure</span>
						</a>
						<ul class="submenu">
							<li><a href="blank.php">Nodes Configuration</a></li>
							
						</ul>
					</li>
					<li class="dropdown">
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-pie-chart"></span><span class="mtext">Charts</span>
						</a>
						<ul class="submenu">
							<li><a href="highchart.php">chart 1</a></li>
							<li><a href="knob-chart.php">chart 2</a></li>
							<li><a href="jvectormap.php">chart 3</a></li>
						</ul>
					</li>
					<li class="dropdown" hidden>
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-clone"></span><span class="mtext">Extra Pages</span>
						</a>
						<ul class="submenu">
							<li><a href="blank.php">Blank</a></li>
							<li><a href="contact-directory.php">Contact Directory</a></li>
							<li><a href="blog.php">Blog</a></li>
							<li><a href="blog-detail.php">Blog Detail</a></li>
							<li><a href="product.php">Product</a></li>
							<li><a href="product-detail.php">Product Detail</a></li>
							<li><a href="faq.php">FAQ</a></li>
							<li><a href="profile.php">Profile</a></li>
							<li><a href="gallery.php">Gallery</a></li>
							<li><a href="pricing-table.php">Pricing Tables</a></li>
						</ul>
					</li>
					<li class="dropdown" hidden>
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-list"></span><span class="mtext">Multi Level Menu</span>
						</a>
						<ul class="submenu">
							<li><a href="javascript:;">Level 1</a></li>
							<li><a href="javascript:;">Level 1</a></li>
							<li><a href="javascript:;">Level 1</a></li>
							<li class="dropdown">
								<a href="javascript:;" class="dropdown-toggle">
									<span class="fa fa-plug"></span><span class="mtext">Level 2</span>
								</a>
								<ul class="submenu child">
									<li><a href="javascript:;">Level 2</a></li>
									<li><a href="javascript:;">Level 2</a></li>
								</ul>
							</li>
							<li><a href="javascript:;">Level 1</a></li>
							<li><a href="javascript:;">Level 1</a></li>
							<li><a href="javascript:;">Level 1</a></li>
						</ul>
					</li>
					<li>
						<a href="sitemap.php" class="dropdown-toggle no-arrow" hidden >
							<span class="fa fa-sitemap"></span><span class="mtext">Sitemap</span>
						</a>
					</li>
					<li>
						<a href="chat.php" class="dropdown-toggle no-arrow" hidden>
							<span class="fa fa-comments-o"></span><span class="mtext">Chat <span class="fi-burst-new text-danger new"></span></span>
						</a>
					</li>
					<li>
						<a href="invoice.php" class="dropdown-toggle no-arrow" hidden>
							<span class="fa fa-map-o"></span><span class="mtext">Invoice</span>
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>

<?php
}
?>


































<?php

if($_SESSION['type']=='1')
{


?>























	<div class="left-side-bar">
		<div class="brand-logo">
			<a href="index.php">
			
			</a>
		</div>
		<div class="menu-block customscroll">
			<div class="sidebar-menu">
				<ul id="accordion-menu">
					<li class="dropdown">
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-home"></span><span class="mtext">Home</span>
						</a>
						<ul class="submenu">
						
							<li ><a href="form-basic.php">Home</a></li>
						</ul>
					</li>
					<li class="dropdown"  >
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-pencil"></span><span class="mtext">Forms</span>
						</a>
						<ul class="submenu">
							<li><a href="form-basic.php">Add Task</a></li>
							<li><a href="advanced-components.php">Add Product</a></li>
							
						</ul>
					</li>
					<li class="dropdown">
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-table"></span><span class="mtext">ALL Tables</span>
						</a>
						<ul class="submenu">
							<li><a href="basic-table.php" hidden >Basic Tables</a></li>
							<li><a href="datatable.php">Tasks Table</a></li>
						
						</ul>
					</li>
					<li>
						<a href="calendar.php" class="dropdown-toggle no-arrow" hidden>
							<span class="fa fa-calendar-o"></span><span class="mtext">Calendar</span>
						</a>
					</li>
					<li hidden class="dropdown">
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-desktop"></span><span class="mtext" hidden> UI Elements </span>
						</a>
						<ul class="submenu">
							<li><a href="ui-buttons.php">Buttons</a></li>
							<li><a href="ui-cards.php">Cards</a></li>
							<li><a href="ui-cards-hover.php">Cards Hover</a></li>
							<li><a href="ui-modals.php">Modals</a></li>
							<li><a href="ui-tabs.php">Tabs</a></li>
							<li><a href="ui-tooltip-popover.php">Tooltip &amp; Popover</a></li>
							<li><a href="ui-sweet-alert.php">Sweet Alert</a></li>
							<li><a href="ui-notification.php">Notification</a></li>
							<li><a href="ui-timeline.php">Timeline</a></li>
							<li><a href="ui-progressbar.php">Progressbar</a></li>
							<li><a href="ui-typography.php">Typography</a></li>
							<li><a href="ui-list-group.php">List group</a></li>
							<li><a href="ui-range-slider.php">Range slider</a></li>
							<li><a href="ui-carousel.php">Carousel</a></li>
						</ul>
					</li>
					<li hidden class="dropdown">
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-paint-brush"></span><span class="mtext">Icons</span>
						</a>
						<ul class="submenu">
							<li><a href="font-awesome.php">FontAwesome Icons</a></li>
							<li><a href="foundation.php">Foundation Icons</a></li>
							<li><a href="ionicons.php">Ionicons Icons</a></li>
							<li><a href="themify.php">Themify Icons</a></li>
						</ul>
					</li>
				
				
					
				
					<li>
						<a href="sitemap.php" class="dropdown-toggle no-arrow" hidden >
							<span class="fa fa-sitemap"></span><span class="mtext">Sitemap</span>
						</a>
					</li>
					<li>
						<a href="chat.php" class="dropdown-toggle no-arrow" hidden>
							<span class="fa fa-comments-o"></span><span class="mtext">Chat <span class="fi-burst-new text-danger new"></span></span>
						</a>
					</li>
					<li>
						<a href="invoice.php" class="dropdown-toggle no-arrow" hidden>
							<span class="fa fa-map-o"></span><span class="mtext">Invoice</span>
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>

<?php
}
?>





























<?php

if($_SESSION['type']=='2')
{


?>























	<div class="left-side-bar">
		<div class="brand-logo">
			<a href="index.php">
			
			</a>
		</div>
		<div class="menu-block customscroll">
			<div class="sidebar-menu">
				<ul id="accordion-menu">
					<li class="dropdown">
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-home"></span><span class="mtext">Home</span>
						</a>
						<ul class="submenu">
						
							<li ><a href="indexworker.php">Home</a></li>
						</ul>
					</li>
				
					<li class="dropdown">
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-table"></span><span class="mtext">ALL Tables</span>
						</a>
						<ul class="submenu">
							<li><a href="basic-table.php" hidden >Basic Tables</a></li>
							<li><a href="datatable.php">Tasks Table</a></li>
							
						</ul>
					</li>
					<li>
						<a href="calendar.php" class="dropdown-toggle no-arrow" hidden>
							<span class="fa fa-calendar-o"></span><span class="mtext">Calendar</span>
						</a>
					</li>
				
					<li hidden class="dropdown">
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-paint-brush"></span><span class="mtext">Icons</span>
						</a>
						<ul class="submenu">
							<li><a href="font-awesome.php">FontAwesome Icons</a></li>
							<li><a href="foundation.php">Foundation Icons</a></li>
							<li><a href="ionicons.php">Ionicons Icons</a></li>
							<li><a href="themify.php">Themify Icons</a></li>
						</ul>
					</li>
				
				
					<li class="dropdown" hidden>
						<a href="javascript:;" class="dropdown-toggle">
							<span class="fa fa-clone"></span><span class="mtext">Extra Pages</span>
						</a>
						<ul class="submenu">
							<li><a href="blank.php">Blank</a></li>
							<li><a href="contact-directory.php">Contact Directory</a></li>
							<li><a href="blog.php">Blog</a></li>
							<li><a href="blog-detail.php">Blog Detail</a></li>
							<li><a href="product.php">Product</a></li>
							<li><a href="product-detail.php">Product Detail</a></li>
							<li><a href="faq.php">FAQ</a></li>
							<li><a href="profile.php">Profile</a></li>
							<li><a href="gallery.php">Gallery</a></li>
							<li><a href="pricing-table.php">Pricing Tables</a></li>
						</ul>
					</li>
				
					<li>
						<a href="sitemap.php" class="dropdown-toggle no-arrow" hidden >
							<span class="fa fa-sitemap"></span><span class="mtext">Sitemap</span>
						</a>
					</li>
					<li>
						<a href="chat.php" class="dropdown-toggle no-arrow" hidden>
							<span class="fa fa-comments-o"></span><span class="mtext">Chat <span class="fi-burst-new text-danger new"></span></span>
						</a>
					</li>
					<li>
						<a href="invoice.php" class="dropdown-toggle no-arrow" hidden>
							<span class="fa fa-map-o"></span><span class="mtext">Invoice</span>
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>

<?php
}
?>

























	<?php
/*
else {
    header('Location: login.php');
}*/
	?>