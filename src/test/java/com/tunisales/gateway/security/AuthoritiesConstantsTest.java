package com.tunisales.gateway.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

/**
 * Unit tests verifying that all 8 TuniSales business roles are declared
 * in AuthoritiesConstants with the correct string values.
 */
class AuthoritiesConstantsTest {

    @Test
    void coreRolesArePresent() {
        assertThat(AuthoritiesConstants.ADMIN).isEqualTo("ROLE_ADMIN");
        assertThat(AuthoritiesConstants.USER).isEqualTo("ROLE_USER");
        assertThat(AuthoritiesConstants.ANONYMOUS).isEqualTo("ROLE_ANONYMOUS");
    }

    @Test
    void businessRolesArePresent() {
        assertThat(AuthoritiesConstants.ADMIN_SYSTEME).isEqualTo("ROLE_ADMIN_SYSTEME");
        assertThat(AuthoritiesConstants.ADMIN_COMMERCIAL).isEqualTo("ROLE_ADMIN_COMMERCIAL");
        assertThat(AuthoritiesConstants.COMMERCIAL).isEqualTo("ROLE_COMMERCIAL");
        assertThat(AuthoritiesConstants.MAGASINIER).isEqualTo("ROLE_MAGASINIER");
        assertThat(AuthoritiesConstants.CLIENT).isEqualTo("ROLE_CLIENT");
        assertThat(AuthoritiesConstants.RESP_PV).isEqualTo("ROLE_RESP_PV");
        assertThat(AuthoritiesConstants.VENDEUR).isEqualTo("ROLE_VENDEUR");
        assertThat(AuthoritiesConstants.CHEF_PARC).isEqualTo("ROLE_CHEF_PARC");
    }

    @Test
    void allBusinessRolesHaveRolePrefix() {
        assertThat(AuthoritiesConstants.ADMIN_SYSTEME).startsWith("ROLE_");
        assertThat(AuthoritiesConstants.ADMIN_COMMERCIAL).startsWith("ROLE_");
        assertThat(AuthoritiesConstants.COMMERCIAL).startsWith("ROLE_");
        assertThat(AuthoritiesConstants.MAGASINIER).startsWith("ROLE_");
        assertThat(AuthoritiesConstants.CLIENT).startsWith("ROLE_");
        assertThat(AuthoritiesConstants.RESP_PV).startsWith("ROLE_");
        assertThat(AuthoritiesConstants.VENDEUR).startsWith("ROLE_");
        assertThat(AuthoritiesConstants.CHEF_PARC).startsWith("ROLE_");
    }
}
