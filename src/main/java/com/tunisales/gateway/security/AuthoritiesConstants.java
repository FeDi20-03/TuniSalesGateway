package com.tunisales.gateway.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String USER = "ROLE_USER";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    // TuniSales business roles
    public static final String ADMIN_SYSTEME = "ROLE_ADMIN_SYSTEME";

    public static final String ADMIN_COMMERCIAL = "ROLE_ADMIN_COMMERCIAL";

    public static final String COMMERCIAL = "ROLE_COMMERCIAL";

    public static final String MAGASINIER = "ROLE_MAGASINIER";

    public static final String CLIENT = "ROLE_CLIENT";

    public static final String RESP_PV = "ROLE_RESP_PV";

    public static final String VENDEUR = "ROLE_VENDEUR";

    public static final String CHEF_PARC = "ROLE_CHEF_PARC";

    private AuthoritiesConstants() {}
}
